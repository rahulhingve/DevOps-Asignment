# 7. Disaster Recovery & High Availability

**Note: This implementation is based on research and theoretical knowledge, as I currently don't have any scalable applications in production. The following strategies are derived from industry best practices and documentation.**

For this deployment, I've outlined a basic disaster recovery strategy that would provide reasonable protection against data loss and minimize downtime. In a more complex production environment, this approach would need to be expanded to include more advanced high availability features.

## Disaster Recovery Strategy

### Recovery Time Objective (RTO)

The Recovery Time Objective defines how quickly the system needs to be back online after an incident:

- **Application (Node.js Express service)**: 30 minutes
- **Infrastructure (Digital Ocean droplet)**: 1 hour

These targets are based on the assumption that this is a non-critical service. For business-critical applications, I would aim for much lower RTOs (minutes rather than hours).

### Recovery Point Objective (RPO)

The Recovery Point Objective defines the maximum acceptable amount of data loss measured in time:

- **Application code**: 0 minutes (code is in GitHub)
- **Configuration**: 24 hours (daily backups)
- **User data**: N/A (stateless application with no database currently)

## Backup Implementation

### 1. Application Code Backup

All application code is stored in GitHub, which serves as the primary backup:

- **Backup schedule**: Continuous (every commit)
- **Retention policy**: Indefinite (GitHub history)
- **Validation**: Automated by GitHub (integrity checks)

Since GitHub itself uses distributed systems with multiple data centers, this provides excellent protection for the application code.

### 2. Server Configuration Backup

Server configuration is backed up using Digital Ocean snapshots:

```bash
# Create a bash script for automated snapshots
cat > /root/backup-scripts/create-snapshot.sh << 'EOL'
#!/bin/bash

# Get the droplet ID from metadata service
DROPLET_ID=$(curl -s http://169.254.169.254/metadata/v1/id)

# Create snapshot using Digital Ocean API
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DO_API_TOKEN" \
  -d '{"type":"snapshot","name":"backup-'"$(date +%Y%m%d)"'"}' \
  "https://api.digitalocean.com/v2/droplets/$DROPLET_ID/actions"

echo "Snapshot created: backup-$(date +%Y%m%d)"
EOL

# Make the script executable
chmod +x /root/backup-scripts/create-snapshot.sh

# Set up a daily cron job
(crontab -l 2>/dev/null; echo "0 1 * * * /root/backup-scripts/create-snapshot.sh") | crontab -
```

- **Backup schedule**: Daily at 1 AM
- **Retention policy**: 7 days (rotating backups)
- **Validation**: Manual inspection of snapshots

### 3. Application State Backup

For the PM2 process manager state, which includes information about running applications:

```bash
# Create a script to back up PM2 state
cat > /root/backup-scripts/backup-pm2.sh << 'EOL'
#!/bin/bash

# Create backup directory if it doesn't exist
mkdir -p /root/backups/pm2

# Save the PM2 process list
pm2 save

# Back up the PM2 dump file
cp -f ~/.pm2/dump.pm2 /root/backups/pm2/dump.pm2.$(date +%Y%m%d)

# Clean up old backups (keep last 7 days)
find /root/backups/pm2 -type f -name "dump.pm2.*" -mtime +7 -delete
EOL

# Make the script executable
chmod +x /root/backup-scripts/backup-pm2.sh

# Set up a daily cron job
(crontab -l 2>/dev/null; echo "0 2 * * * /root/backup-scripts/backup-pm2.sh") | crontab -
```

- **Backup schedule**: Daily at 2 AM
- **Retention policy**: 7 days
- **Validation**: Automatic (PM2 validates its dump file)

## Disaster Recovery Process

In the event of a disaster, I would follow this recovery process:

### 1. Infrastructure Recovery

1. Create a new Digital Ocean droplet from the most recent snapshot:
   ```bash
   doctl compute droplet create --snapshot [snapshot-id] --size s-1vcpu-1gb --region blr1 recovery-droplet
   ```

2. Update DNS records to point to the new droplet:
   ```bash
   doctl compute domain records update [domain] --record-id [record-id] --record-data [new-ip]
   ```

### 2. Application Recovery

1. If the droplet was restored from a snapshot, the application should already be operational.

2. If not, I would deploy the application from GitHub:
   ```bash
   git clone https://github.com/[username]/[repo].git /root/Assignment/DevOps-Asignment
   cd /root/Assignment/DevOps-Asignment
   npm install
   pm2 start index.js
   ```

3. Verify that the application is running correctly:
   ```bash
   curl http://localhost:3100
   ```

## High Availability Implementation

While the current deployment is a single-server setup, here's how I would implement high availability in a production environment:

### 1. Load Balancing

I would use Digital Ocean Load Balancer to distribute traffic across multiple instances:

```
┌─────────────────┐
│                 │
│  Load Balancer  │
│                 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  Web Server 1   │     │  Web Server 2   │
│  (Primary)      │     │  (Replica)      │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
```

Configuration:
```bash
doctl compute droplet create --image ubuntu-22-04-x64 --size s-1vcpu-1gb --region blr1 web-server-1 web-server-2

doctl compute load-balancer create --name app-lb --region blr1 --droplet-ids [id1],[id2] --forwarding-rules entry_protocol:http,entry_port:80,target_protocol:http,target_port:3100
```

### 2. Automated Failover

PM2 would be configured with the cluster mode to utilize multiple CPU cores and automatic restart capabilities:

```bash
pm2 start index.js -i max  # Uses all available CPU cores

# Configure PM2 to restart on server boot
pm2 startup
pm2 save
```

### 3. Data Replication

If a database were added to the application, I would implement replication:

```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  Primary DB     │────▶│  Replica DB     │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
```

For MongoDB, this would involve setting up a replica set:
```bash
# Configure replica set in mongod.conf
replication:
  replSetName: "rs0"
```

## Automated Recovery Testing

To ensure that the disaster recovery plan works, I would implement automated recovery testing:

```bash
# Create a script for testing recovery
cat > /root/test-recovery.sh << 'EOL'
#!/bin/bash

echo "=== Testing Disaster Recovery Process ==="

# Test restoration from snapshot
echo "Creating test droplet from latest snapshot..."
SNAPSHOT_ID=$(doctl compute snapshot list --format ID --no-header | head -n 1)
DROPLET_ID=$(doctl compute droplet create --snapshot $SNAPSHOT_ID --size s-1vcpu-1gb --region blr1 recovery-test --format ID --no-header)

# Wait for droplet to be ready
echo "Waiting for droplet to be ready..."
sleep 60

# Get the droplet IP
DROPLET_IP=$(doctl compute droplet get $DROPLET_ID --format PublicIPv4 --no-header)

# Test if application is responding
echo "Testing application response..."
RESPONSE=$(curl -s http://$DROPLET_IP:3100)

if [[ $RESPONSE == *"Hello"* ]]; then
  echo "SUCCESS: Application is responding correctly"
else
  echo "FAILURE: Application is not responding correctly"
fi

# Clean up
echo "Cleaning up test resources..."
doctl compute droplet delete $DROPLET_ID --force

echo "=== Recovery Testing Completed ==="
EOL

# Make the script executable
chmod +x /root/test-recovery.sh

# Schedule monthly tests
(crontab -l 2>/dev/null; echo "0 0 1 * * /root/test-recovery.sh > /var/log/recovery-test-\$(date +\%Y\%m).log 2>&1") | crontab -
```

This script would create a test droplet from the latest snapshot, verify that the application is working correctly, and then clean up the test resources.

## Conclusion

This disaster recovery and high availability strategy provides a balance between cost and reliability for a small application. In a production environment with more critical requirements, I would enhance the approach with:

1. Multi-region deployments for geographic redundancy
2. More sophisticated monitoring and alerting
3. Automatic failover between regions
4. Regular disaster recovery drills with the team 