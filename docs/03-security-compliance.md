# 3. Security & Compliance

Security is super important! Here are three major security risks I identified in my DevOps workflow and how I mitigated them in accordance with ISO 27001, GDPR, and SOC 2 compliance requirements.

## Risk 1: Unauthorized Server Access

**Risk Description**: Unauthorized access to production servers could lead to data breaches, service disruption, or malicious code injection. This is especially concerning for internet-facing servers.

**Mitigation Strategy**:
- Completely disabled password authentication for SSH
- Implemented SSH key-based authentication only
- Limited SSH access to specific IP addresses through firewall rules
- Set up a regular schedule to rotate SSH keys
- Configured SSH to use only strong ciphers and key exchange algorithms

**Compliance Alignment**: 
- **ISO 27001**: Aligns with control A.9.4.2 (User authentication for external connections) and A.9.2.4 (Management of secret authentication information)
- **SOC 2**: Aligns with the Common Criteria related to logical and physical access controls
- **GDPR**: Helps meet Article 32 requirements for implementing appropriate technical measures to ensure security

## Risk 2: Insecure Deployment Pipeline

**Risk Description**: If the CI/CD pipeline is not properly secured, it could be exploited to inject malicious code into the production environment, potentially leading to data breaches.

**Mitigation Strategy**:
- Stored all secrets securely in GitHub Secrets (not hardcoded anywhere!)
- Implemented branch protection rules so only approved PRs can be merged
- Used SCP for secure file transfer during deployment
- Implemented code review process before merging to main branch
- Limited GitHub Actions workflow permissions to only what's necessary

**Compliance Alignment**:
- **ISO 27001**: Aligns with control A.14.2.2 (System change control procedures) and A.14.2.8 (System security testing)
- **GDPR**: Supports Article 25 (Data protection by design) by ensuring secure deployment processes
- **SOC 2**: Aligns with the Change Management criteria in the Trust Services Criteria

## Risk 3: Outdated Dependencies and Vulnerabilities

**Risk Description**: Using outdated packages or software with known vulnerabilities exposes the application to potential exploitation.

**Mitigation Strategy**:
- Implemented regular dependency updates
- Used `npm audit` to check for vulnerabilities in Node.js packages
- Selected well-maintained packages with active communities
- Implemented version pinning for dependencies to avoid unexpected updates
- Set up automatic security scanning of the codebase

**Compliance Alignment**:
- **ISO 27001**: Aligns with control A.12.6.1 (Management of technical vulnerabilities)
- **SOC 2**: Supports the Risk Management and Risk Mitigation criteria
- **GDPR**: Helps meet the Article 32 requirement for regular testing and evaluating security measures

## Security Best Practices in Cloud Deployments

Beyond addressing specific risks, I've implemented these general security best practices in my cloud deployment:

1. **Principle of Least Privilege**:
   - Limited user permissions to only what's necessary for their function
   - Used service accounts with minimal permissions for automated processes

2. **Defense in Depth**:
   - Implemented multiple layers of security (network, application, authentication)
   - Used firewall rules to restrict access to only necessary ports
   - Configured the application to run as a non-root user

3. **Regular Updates and Patches**:
   - Set up automatic security updates for the operating system
   - Scheduled weekly maintenance windows for applying updates
   - Monitored security mailing lists for critical vulnerabilities

4. **Secure Communication**:
   - Enforced HTTPS for all external communications using SSL certificate
   - Implemented proper certificate management with Certbot for auto-renewal
   - Set up Nginx with secure SSL configurations
   - Configured SSL to use only modern, secure protocols and ciphers

5. **Logging and Monitoring**:
   - Set up comprehensive logging for security events
   - Implemented alerts for suspicious activities
   - Regularly reviewed security logs for potential issues

## SSL Implementation

To secure the application with HTTPS, I installed an SSL certificate using Certbot:


This SSL implementation not only encrypts the data in transit but also helps maintain compliance with security standards by ensuring that all communication with the application is protected.

These practices align with ISO 27001's approach to information security management, GDPR's requirements for data protection, and SOC 2's Trust Services Criteria for security and availability. 