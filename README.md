# DevOps Assignment

Hey there! This is my submission for the DevOps internship assignment. I've worked on implementing a simple Node.js app with a complete CI/CD pipeline using GitHub Actions and Digital Ocean.

## Quick Overview

- **Application**: Simple Express.js web server running on port 3100
- **Deployment**: Digital Ocean droplet with CI/CD via GitHub Actions (used DO instead of Azure due to account setup issues)
- **Technologies**: Node.js, Express, PM2, GitHub Actions, SSH, Digital Ocean, Grafana, Prometheus

## Detailed Documentation

I've created detailed documentation for each part of the assignment in the [docs](./docs) directory:

1. [Cloud Infrastructure & Deployment](./docs/01-cloud-infrastructure.md)
2. [CI/CD Pipeline Implementation](./docs/02-cicd-pipeline.md)
3. [Security & Compliance](./docs/03-security-compliance.md)
4. [Monitoring & Logging](./docs/04-monitoring-logging.md)
5. [Database & Storage Optimization](./docs/05-database-optimization.md)
6. [Automation & Scripting](./docs/06-automation-scripting.md)
7. [Disaster Recovery & High Availability](./docs/07-disaster-recovery.md)
8. [AI Model Deployment & MLOps](./docs/08-mlops.md)

## Repository Structure

```
/
├── .github/workflows/  # CI/CD pipeline configuration
├── docs/               # Detailed documentation
├── screenshots/        # Screenshots of the deployment
├── index.js            # Main application file
├── package.json        # Node.js dependencies
└── README.md           # This file
```

## How to Run Locally

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/DevOps-Assignment.git
   cd DevOps-Assignment
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the application
   ```bash
   node index.js
   ```

4. Open http://localhost:3100 in your browser

## Live Demo

The application is running at [https://assignment1.rahulhingve.pro/](https://assignment1.rahulhingve.pro/)

I've also secured the application with SSL by installing a certificate using Certbot, so you can access it via HTTPS. This adds an extra layer of security to the deployment.

## Final Thoughts

This project was a great learning experience! If I had more time, I would've added:
- More extensive testing
- Better monitoring with Prometheus and Grafana
- CI/CD stages for testing before deployment
- A more complex application with a real database

Thanks for reviewing my submission! Let me know if you have any questions or need more details about any part of it.
