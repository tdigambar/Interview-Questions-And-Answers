# AWS (Amazon Web Services) Interview Questions and Answers

## Basic Level

### 1. What is AWS?
Amazon Web Services (AWS) is a comprehensive cloud computing platform provided by Amazon that offers a mix of Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS) offerings. It provides on-demand cloud computing services including computing power, storage, databases, and networking.

### 2. What are the main components/services of AWS?

- **Compute**: EC2, Lambda, ECS, EKS, Elastic Beanstalk
- **Storage**: S3, EBS, EFS, Glacier
- **Database**: RDS, DynamoDB, Aurora, Redshift
- **Networking**: VPC, Route 53, CloudFront, API Gateway
- **Security**: IAM, KMS, Secrets Manager, WAF
- **Management**: CloudWatch, CloudFormation, CloudTrail
- **Analytics**: Athena, EMR, Kinesis
- **Developer Tools**: CodePipeline, CodeBuild, CodeDeploy

### 3. What is EC2?
EC2 (Elastic Compute Cloud) is a web service that provides resizable compute capacity in the cloud. It allows you to launch virtual servers (instances) with various configurations of CPU, memory, storage, and networking capacity. You can scale up or down based on requirements and only pay for what you use.

### 4. What are the different types of EC2 instances?

- **General Purpose**: T3, T2, M5, M6 - Balanced compute, memory, and networking
- **Compute Optimized**: C5, C6 - High-performance processors for compute-intensive tasks
- **Memory Optimized**: R5, R6, X1 - Large memory for memory-intensive applications
- **Storage Optimized**: I3, D2 - High sequential read/write access to large datasets
- **Accelerated Computing**: P3, P4, G4 - GPU instances for machine learning and graphics

### 5. What is S3?
S3 (Simple Storage Service) is an object storage service that offers industry-leading scalability, data availability, security, and performance. It's designed to store and retrieve any amount of data from anywhere on the web. Data is stored as objects within buckets.

### 6. What are S3 storage classes?

- **S3 Standard**: Frequently accessed data
- **S3 Intelligent-Tiering**: Automatic cost optimization
- **S3 Standard-IA**: Infrequently accessed data
- **S3 One Zone-IA**: Less frequently accessed, single AZ
- **S3 Glacier Instant Retrieval**: Archive with instant access
- **S3 Glacier Flexible Retrieval**: Archive with retrieval in minutes to hours
- **S3 Glacier Deep Archive**: Lowest cost, retrieval in hours

### 7. What is IAM?
IAM (Identity and Access Management) is a web service that helps you securely control access to AWS resources. It enables you to create and manage AWS users and groups, and use permissions to allow or deny access to AWS resources.

**Key components:**

- **Users**: Individual identities
- **Groups**: Collections of users
- **Roles**: Set of permissions for AWS services
- **Policies**: JSON documents defining permissions

### 8. What is the difference between Region and Availability Zone?

- **Region**: A geographical area containing multiple isolated locations (e.g., us-east-1, eu-west-1)
- **Availability Zone (AZ)**: One or more discrete data centers within a region with redundant power, networking, and connectivity

**Example**: us-east-1 (Region) contains us-east-1a, us-east-1b, us-east-1c (Availability Zones)

### 9. What is VPC?
VPC (Virtual Private Cloud) is a virtual network dedicated to your AWS account. It's logically isolated from other virtual networks in the AWS Cloud. You can launch AWS resources like EC2 instances into your VPC.

**Components:**

- Subnets (public and private)
- Route tables
- Internet Gateway
- NAT Gateway
- Security Groups
- Network ACLs

### 10. What is the difference between Security Groups and Network ACLs?

| Feature | Security Groups | Network ACLs |
|---------|----------------|--------------|
| **Level** | Instance level | Subnet level |
| **State** | Stateful (return traffic automatically allowed) | Stateless (return traffic must be explicitly allowed) |
| **Rules** | Support allow rules only | Support allow and deny rules |
| **Processing** | Evaluate all rules | Process rules in order |
| **Applied to** | Instances | Subnets |

### 11. What is an AMI?
AMI (Amazon Machine Image) provides the information required to launch an instance. It includes:

- Operating system
- Application server
- Applications
- Configuration settings

You can launch multiple instances from a single AMI or create your own custom AMIs.

### 12. What is EBS?
EBS (Elastic Block Store) provides block-level storage volumes for use with EC2 instances. EBS volumes are:

- Persistent (data remains after instance termination if configured)
- Automatically replicated within an AZ
- Can be backed up using snapshots
- Can be attached to running instances

### 13. What is the difference between EBS and Instance Store?

| Feature | EBS | Instance Store |
|---------|-----|----------------|
| **Persistence** | Persistent storage | Ephemeral (temporary) storage |
| **Data survival** | Data survives instance stop/restart | Data lost when instance stops |
| **Flexibility** | Can be detached and reattached | Physically attached to host |
| **Connection** | Network-attached | Local disk |
| **Cost** | More expensive | Included in instance price |

## Intermediate Level

### 14. What is AWS Lambda?
AWS Lambda is a serverless compute service that runs code in response to events without provisioning or managing servers. You pay only for the compute time consumed.

**Key features:**

- Automatic scaling
- No server management
- Pay per invocation and duration
- Supports multiple languages (Node.js, Python, Java, Go, etc.)
- Event-driven execution
- 15-minute maximum execution time

### 15. What are Lambda triggers/event sources?

- API Gateway (HTTP requests)
- S3 (object uploads/deletes)
- DynamoDB (stream changes)
- SNS/SQS (messages)
- CloudWatch Events (scheduled events)
- Kinesis (streaming data)
- Application Load Balancer

### 16. What is RDS?
RDS (Relational Database Service) is a managed relational database service that supports multiple database engines:

- Amazon Aurora
- MySQL
- PostgreSQL
- MariaDB
- Oracle
- SQL Server

**Benefits:**

- Automated backups
- Software patching
- Automatic failover
- Read replicas
- Multi-AZ deployment

### 17. What is DynamoDB?
DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance with seamless scalability.

**Features:**

- Key-value and document data models
- Single-digit millisecond latency
- Automatic scaling
- Built-in security
- On-demand and provisioned capacity modes
- Global tables for multi-region replication

### 18. What is CloudFormation?
CloudFormation is an Infrastructure as Code (IaC) service that allows you to model and provision AWS resources using templates (JSON or YAML).

**Benefits:**

- Automate resource provisioning
- Version control infrastructure
- Repeatable deployments
- Rollback capabilities
- Manage dependencies

**Example template:**

```yaml
Resources:
  MyS3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: my-unique-bucket-name
      
  MyEC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0c55b159cbfafe1f0
      InstanceType: t2.micro
```

### 19. What is CloudWatch?
CloudWatch is a monitoring and observability service for AWS resources and applications.

**Features:**

- Collect and track metrics
- Collect and monitor log files
- Set alarms
- Automatically react to changes
- View graphs and statistics

**Common uses:**

- Monitor EC2 CPU utilization
- Track application logs
- Set billing alarms
- Monitor Lambda execution

### 20. What is Elastic Load Balancer (ELB)?
ELB automatically distributes incoming application traffic across multiple targets (EC2 instances, containers, IP addresses).

**Types:**

- **Application Load Balancer (ALB)**: Layer 7, HTTP/HTTPS traffic
- **Network Load Balancer (NLB)**: Layer 4, TCP/UDP traffic, ultra-high performance
- **Gateway Load Balancer**: Layer 3, third-party virtual appliances
- **Classic Load Balancer**: Legacy, Layer 4 and 7

### 21. What is Auto Scaling?
Auto Scaling automatically adjusts the number of EC2 instances based on conditions you define.

**Components:**

- **Launch Template/Configuration**: Instance specifications
- **Auto Scaling Group**: Group of instances
- **Scaling Policies**: Rules for scaling (CPU, memory, schedule)

**Types of scaling:**

- Target tracking scaling
- Step scaling
- Simple scaling
- Scheduled scaling

### 22. What is Route 53?
Route 53 is AWS's scalable Domain Name System (DNS) web service designed to route end users to internet applications.

**Features:**

- Domain registration
- DNS routing
- Health checking
- Traffic management

**Routing policies:**

- Simple routing
- Weighted routing
- Latency-based routing
- Failover routing
- Geolocation routing
- Geoproximity routing
- Multi-value answer routing

### 23. What is CloudFront?

AWS CloudFront is a global content delivery network (CDN) that caches content like web pages, videos, and images at edge locations closer to users, which speeds up delivery and improves performance. When a user requests content, CloudFront serves it from the nearest edge location. If the content isn't cached there, it fetches it from the origin (like an Amazon S3 bucket or web server), caches it, and then delivers it to the user.

**Key Features and Benefits:**

- **Accelerated content delivery**: By storing copies of content in multiple data centers around the world, CloudFront significantly reduces latency and improves loading times for users.
- **Global network**: It uses a worldwide network of data centers called "edge locations" to deliver content from the location that provides the lowest latency for each user.
- **Content types**: It can deliver a wide range of content, including static and dynamic web content, large files, software updates, and live and on-demand video streaming.
- **Scalability and reliability**: CloudFront automatically scales to handle high traffic volumes and provides data redundancy, which improves reliability.
- **Integration with other AWS services**: It integrates seamlessly with other AWS services like Amazon S3 and AWS WAF for security.
- **Programmable at the edge**: Through features like CloudFront Functions and AWS Lambda@Edge, you can run code at edge locations for tasks like URL rewrites, header manipulation, and more, with minimal latency.
- **DDoS protection**: Built-in protection against distributed denial-of-service attacks.
- **SSL/TLS encryption**: Secure content delivery with HTTPS support.
- **Real-time metrics**: Monitor performance and usage patterns through CloudWatch.

**How It Works:**

1. A user requests content from a website or application.
2. CloudFront routes the request to the edge location that is geographically closest to the user, providing the lowest latency.
3. If the content is already stored in that edge location's cache, CloudFront delivers it to the user immediately.
4. If the content is not in the cache, CloudFront retrieves the definitive version of the content from the origin server (e.g., an S3 bucket or an HTTP server), caches it at the edge location, and then delivers it to the user.
5. Subsequent requests for the same content from users in that region will be served from the cache

### 24. What is Elastic Beanstalk?
Elastic Beanstalk is a PaaS that makes it easy to deploy and scale web applications and services. You upload your code, and Elastic Beanstalk handles deployment, capacity provisioning, load balancing, and auto-scaling.

**Supported platforms:**

- Node.js, Python, Ruby, PHP
- Java, .NET, Go
- Docker

### 25. What is SNS?
SNS (Simple Notification Service) is a fully managed pub/sub messaging service for A2A (application-to-application) and A2P (application-to-person) communication.

**Use cases:**

- Send notifications to mobile devices
- Email notifications
- Trigger Lambda functions
- Fan-out messages to SQS queues
- SMS messages

### 26. What is SQS?
SQS (Simple Queue Service) is a fully managed message queuing service for decoupling and scaling microservices, distributed systems, and serverless applications.

**Queue types:**

- **Standard Queue**: Maximum throughput, at-least-once delivery, best-effort ordering
- **FIFO Queue**: Exactly-once processing, strict ordering

### 27. What is the difference between SNS and SQS?

| Feature | SNS | SQS |
|---------|-----|-----|
| **Type** | Pub/Sub messaging | Queue-based messaging |
| **Mechanism** | Push mechanism | Pull mechanism |
| **Consumers** | Multiple subscribers | Single consumer per message |
| **Persistence** | No message persistence | Messages stored until processed |
| **Delivery** | Real-time delivery | Asynchronous processing |

## Advanced Level

### 28. What is AWS Well-Architected Framework?
The AWS Well-Architected Framework provides best practices for designing and operating reliable, secure, efficient, and cost-effective systems in the cloud.

**Six Pillars:**

1. **Operational Excellence**: Run and monitor systems
2. **Security**: Protect information and systems
3. **Reliability**: Recover from failures and scale
4. **Performance Efficiency**: Use resources efficiently
5. **Cost Optimization**: Avoid unnecessary costs
6. **Sustainability**: Minimize environmental impact

### 29. What is Multi-AZ deployment?
Multi-AZ deployment provides high availability and failover support by replicating data across multiple Availability Zones.

**Example with RDS:**

- Primary database in one AZ
- Synchronous replication to standby in another AZ
- Automatic failover in case of failure
- DNS endpoint remains the same

### 30. What are Read Replicas in RDS?
Read Replicas allow you to create read-only copies of your database to improve read performance.

**Features:**

- Asynchronous replication
- Can be in different regions
- Can be promoted to standalone database
- Offload read traffic from primary
- Up to 5 read replicas per database

### 31. What is AWS VPN?
AWS VPN solutions connect your on-premises networks to AWS.

**Types:**

- **Site-to-Site VPN**: Connect entire network to AWS
- **Client VPN**: Individual users connect to AWS

**Components:**

- Virtual Private Gateway (VGW)
- Customer Gateway (CGW)
- VPN Connection

### 32. What is Direct Connect?
Direct Connect is a dedicated network connection from your premises to AWS, providing more consistent network performance than internet-based connections.

**Benefits:**

- Reduced bandwidth costs
- Consistent network performance
- Private connectivity
- Compatible with all AWS services

### 33. What is API Gateway?
API Gateway is a fully managed service for creating, publishing, maintaining, monitoring, and securing APIs at any scale.

**Features:**

- RESTful APIs and WebSocket APIs
- Request/response transformation
- Authentication and authorization
- Rate limiting and throttling
- Caching
- Integration with Lambda, EC2, and other services

### 34. What is ECS vs EKS?
**ECS (Elastic Container Service):**

- AWS-native container orchestration
- Simpler to use
- Deep AWS integration
- Uses Docker containers

**EKS (Elastic Kubernetes Service):**

- Managed Kubernetes service
- Industry-standard container orchestration
- More complex but more flexible
- Portable across clouds

### 35. What is AWS Fargate?
Fargate is a serverless compute engine for containers that works with both ECS and EKS. You don't need to provision or manage servers.

**Benefits:**

- No server management
- Pay per use
- Automatic scaling
- Built-in security

### 36. What is AWS Secrets Manager?
Secrets Manager helps you protect access to applications, services, and IT resources by managing secrets (database credentials, API keys, etc.).

**Features:**

- Automatic secret rotation
- Fine-grained access control
- Audit and compliance
- Encryption at rest

### 37. What is KMS (Key Management Service)?
KMS is a managed service for creating and controlling encryption keys.

**Features:**

- Create and manage cryptographic keys
- Control key usage across AWS services
- Integrated with CloudTrail for auditing
- FIPS 140-2 validated

### 38. What is AWS Organizations?
AWS Organizations helps you centrally manage and govern multiple AWS accounts.

**Features:**

- Consolidated billing
- Service Control Policies (SCPs)
- Organizational Units (OUs)
- Account management
- Cost allocation

### 39. What is CloudTrail?
CloudTrail logs, monitors, and retains account activity related to actions across your AWS infrastructure.

**Use cases:**

- Security analysis
- Compliance auditing
- Operational troubleshooting
- Risk auditing

### 40. What is AWS Config?
AWS Config continuously monitors and records AWS resource configurations and allows you to automate evaluation against desired configurations.

**Features:**

- Configuration history
- Compliance tracking
- Change notifications
- Relationship tracking

### 41. What is disaster recovery in AWS?
**DR Strategies (by cost and RTO/RPO):**

1. **Backup and Restore**: Lowest cost, highest RTO/RPO
   - Regular backups to S3
   - Restore when needed

2. **Pilot Light**: Minimal version always running
   - Core infrastructure running
   - Scale up during disaster

3. **Warm Standby**: Scaled-down version running
   - Fully functional but minimal capacity
   - Scale up during disaster

4. **Multi-Site Active-Active**: Lowest RTO/RPO, highest cost
   - Full production in multiple regions
   - Traffic distributed across sites

### 42. What is S3 Cross-Region Replication?
CRR automatically replicates objects across S3 buckets in different AWS regions.

**Use cases:**

- Compliance requirements
- Minimize latency
- Disaster recovery
- Data replication

**Requirements:**

- Versioning enabled on both buckets
- Proper IAM permissions
- Different regions for source and destination

### 43. What is AWS Lambda@Edge?
Lambda@Edge lets you run Lambda functions at CloudFront edge locations to customize content delivery.

**Use cases:**

- A/B testing
- User authentication
- Bot detection
- Image transformation
- Request/response manipulation

### 44. What is AWS Step Functions?
Step Functions is a serverless orchestration service for coordinating multiple AWS services into serverless workflows.

**Features:**

- Visual workflow designer
- Built-in error handling
- Automatic retry logic
- Parallel execution
- State management

### 45. What are the best practices for AWS security?

- Use IAM roles instead of access keys
- Enable MFA for privileged users
- Apply least privilege principle
- Enable CloudTrail for auditing
- Encrypt data at rest and in transit
- Use Security Groups as firewalls
- Regular security audits with AWS Config
- Keep software updated
- Use AWS WAF for web applications
- Implement backup strategy
- Use VPC for network isolation
- Enable GuardDuty for threat detection

### 46. How do you optimize AWS costs?

- **Right-size instances**: Match resources to workload
- **Use Reserved Instances**: For predictable workloads
- **Use Spot Instances**: For fault-tolerant workloads
- **Enable Auto Scaling**: Scale based on demand
- **Use S3 lifecycle policies**: Move data to cheaper storage
- **Delete unused resources**: EBS volumes, snapshots, EIPs
- **Use AWS Cost Explorer**: Analyze spending patterns
- **Set up billing alerts**: Monitor costs
- **Use CloudWatch**: Monitor and optimize
- **Leverage AWS Trusted Advisor**: Get recommendations

### 47. What is AWS Transit Gateway?
Transit Gateway is a network transit hub that connects VPCs and on-premises networks through a central hub.

**Benefits:**

- Simplified network architecture
- Centralized routing
- Scalable connectivity
- Reduced operational overhead

### 48. What is Amazon Aurora?
Aurora is a MySQL and PostgreSQL-compatible relational database built for the cloud.

**Features:**

- 5x faster than MySQL, 3x faster than PostgreSQL
- Auto-scaling storage up to 128TB
- Up to 15 read replicas
- Continuous backup to S3
- Multi-AZ deployment
- Global database for low-latency global reads

### 49. What is AWS Glue?
Glue is a fully managed ETL (Extract, Transform, Load) service for preparing data for analytics.

**Features:**

- Data catalog
- Automatic schema discovery
- ETL job authoring
- Serverless execution
- Integration with S3, RDS, Redshift

### 50. What is the shared responsibility model in AWS?
**AWS Responsibility (Security OF the Cloud):**

- Physical infrastructure
- Hardware and software
- Network infrastructure
- Virtualization layer

**Customer Responsibility (Security IN the Cloud):**

- Data encryption
- IAM policies
- Network configuration
- Application security
- OS patching
- Firewall configuration

---

These questions cover AWS fundamentals through advanced concepts and should thoroughly prepare you for an AWS interview!
