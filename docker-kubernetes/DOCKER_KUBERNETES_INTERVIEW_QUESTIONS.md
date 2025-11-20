# Docker and Kubernetes Interview Questions and Answers

This comprehensive guide covers essential Docker and Kubernetes interview questions from basic concepts to advanced topics. Each question includes detailed answers with practical examples.

## Table of Contents

1. [Docker Fundamentals](#docker-fundamentals)
2. [Docker Images and Containers](#docker-images-and-containers)
3. [Docker Compose](#docker-compose)
4. [Kubernetes Fundamentals](#kubernetes-fundamentals)
5. [Kubernetes Objects](#kubernetes-objects)
6. [Kubernetes Networking](#kubernetes-networking)
7. [Best Practices](#best-practices)

---

## Docker Fundamentals

### 1. What is Docker and what are its key features?

**Answer:**
Docker is a platform for developing, shipping, and running applications using containerization. It packages applications and their dependencies into containers that can run consistently across different environments.

**Key Features:**
1. **Containerization**: Isolated environments for applications
2. **Portability**: Run anywhere (dev, staging, production)
3. **Lightweight**: Shares OS kernel, smaller than VMs
4. **Fast**: Quick startup and deployment
5. **Scalable**: Easy to scale containers
6. **Version Control**: Image versioning and tagging

**Docker vs Virtual Machines:**
| Feature | Docker | Virtual Machine |
|---------|--------|----------------|
| **OS** | Shares host OS | Full OS per VM |
| **Size** | MBs | GBs |
| **Startup** | Seconds | Minutes |
| **Isolation** | Process level | Hardware level |
| **Resource Usage** | Lower | Higher |

**Example:**
```bash
# Run a container
docker run -d -p 8080:80 nginx

# List running containers
docker ps

# View container logs
docker logs <container-id>
```

### 2. What is the difference between Docker image and container?

**Answer:**

**Docker Image:**
- Read-only template for creating containers
- Contains application code, dependencies, and configuration
- Built from Dockerfile
- Stored in registry (Docker Hub, ECR, etc.)
- Immutable (cannot be changed)

**Docker Container:**
- Running instance of an image
- Has a writable layer on top of image
- Can be started, stopped, deleted
- Ephemeral (data lost when deleted, unless volumes used)

**Example:**
```bash
# Image (template)
docker pull nginx:latest
docker images

# Container (running instance)
docker run -d --name my-nginx nginx:latest
docker ps

# Multiple containers from same image
docker run -d --name nginx1 nginx:latest
docker run -d --name nginx2 nginx:latest
```

### 3. What is a Dockerfile?

**Answer:**
Dockerfile is a text file with instructions to build a Docker image. It defines the environment and steps to create the image.

**Common Instructions:**
```dockerfile
# Base image
FROM node:18-alpine

# Working directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Run command
CMD ["node", "server.js"]
```

**Example Dockerfile:**
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Environment variable
ENV PORT=8080

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/health || exit 1

# Run application
CMD ["python", "app.py"]
```

---

## Docker Images and Containers

### 4. What are Docker volumes?

**Answer:**
Docker volumes are used to persist data and share data between containers. Data in volumes survives container deletion.

**Types of Volumes:**
1. **Named Volumes**: Managed by Docker
2. **Bind Mounts**: Mount host directory
3. **Anonymous Volumes**: Temporary volumes

**Example:**
```bash
# Create named volume
docker volume create mydata

# Use volume in container
docker run -d -v mydata:/data nginx

# Bind mount
docker run -d -v /host/path:/container/path nginx

# Volume in Dockerfile
VOLUME ["/data"]
```

---

## Kubernetes Fundamentals

### 5. What is Kubernetes and what are its key features?

**Answer:**
Kubernetes (K8s) is an open-source container orchestration platform that automates deployment, scaling, and management of containerized applications.

**Key Features:**
1. **Service Discovery**: Automatic service discovery
2. **Load Balancing**: Distributes traffic across pods
3. **Self-healing**: Restarts failed containers
4. **Auto-scaling**: Scales based on demand
5. **Rolling Updates**: Zero-downtime deployments
6. **Secret Management**: Secure configuration management

**Kubernetes Architecture:**
```
Master Node (Control Plane)
├── API Server
├── etcd (database)
├── Scheduler
└── Controller Manager

Worker Nodes
├── kubelet
├── kube-proxy
└── Container Runtime (Docker/containerd)
```

**Example:**
```bash
# Deploy application
kubectl create deployment nginx --image=nginx

# Scale deployment
kubectl scale deployment nginx --replicas=3

# Expose service
kubectl expose deployment nginx --port=80 --type=LoadBalancer
```

### 6. What is the difference between Docker and Kubernetes?

**Answer:**

| Feature | Docker | Kubernetes |
|---------|--------|------------|
| **Purpose** | Containerization | Container orchestration |
| **Scope** | Single host | Multiple hosts (cluster) |
| **Scaling** | Manual | Automatic |
| **Load Balancing** | External tools | Built-in |
| **Service Discovery** | External tools | Built-in |
| **Use Case** | Development, single apps | Production, microservices |

**Relationship:**
- Docker creates containers
- Kubernetes manages Docker containers (or other runtimes)
- Kubernetes runs on top of Docker/containerd

---

## Kubernetes Objects

### 7. What are Pods, Deployments, and Services in Kubernetes?

**Answer:**

**Pod:**
- Smallest deployable unit in Kubernetes
- Contains one or more containers
- Shares network and storage
- Ephemeral (recreated if fails)

**Deployment:**
- Manages Pods
- Provides rolling updates
- Handles scaling
- Ensures desired state

**Service:**
- Exposes Pods to network
- Provides stable IP and DNS
- Load balances traffic
- Types: ClusterIP, NodePort, LoadBalancer

**Example:**
```yaml
# Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80

---
# Service
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

---

## Docker Compose

### 5. What is Docker Compose?

**Answer:**
Docker Compose is a tool for defining and running multi-container Docker applications. It uses a YAML file to configure services.

**Example docker-compose.yml:**
```yaml
version: '3.8'
services:
  web:
    image: nginx
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html
  
  db:
    image: postgres:13
    environment:
      POSTGRES_PASSWORD: password
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

**Commands:**
```bash
docker-compose up -d
docker-compose down
docker-compose ps
docker-compose logs
```

---

## Kubernetes Fundamentals

### 6. What is Kubernetes and what are its key features?

**Answer:**
Kubernetes (K8s) is an open-source container orchestration platform that automates deployment, scaling, and management of containerized applications.

**Key Features:**
1. **Service Discovery**: Automatic service discovery
2. **Load Balancing**: Distributes traffic across pods
3. **Self-healing**: Restarts failed containers
4. **Auto-scaling**: Scales based on demand
5. **Rolling Updates**: Zero-downtime deployments
6. **Secret Management**: Secure configuration management

**Kubernetes Architecture:**
```
Master Node (Control Plane)
├── API Server
├── etcd (database)
├── Scheduler
└── Controller Manager

Worker Nodes
├── kubelet
├── kube-proxy
└── Container Runtime (Docker/containerd)
```

**Example:**
```bash
# Deploy application
kubectl create deployment nginx --image=nginx

# Scale deployment
kubectl scale deployment nginx --replicas=3

# Expose service
kubectl expose deployment nginx --port=80 --type=LoadBalancer
```

### 7. What is the difference between Docker and Kubernetes?

**Answer:**

| Feature | Docker | Kubernetes |
|---------|--------|------------|
| **Purpose** | Containerization | Container orchestration |
| **Scope** | Single host | Multiple hosts (cluster) |
| **Scaling** | Manual | Automatic |
| **Load Balancing** | External tools | Built-in |
| **Service Discovery** | External tools | Built-in |
| **Use Case** | Development, single apps | Production, microservices |

**Relationship:**
- Docker creates containers
- Kubernetes manages Docker containers (or other runtimes)
- Kubernetes runs on top of Docker/containerd

---

## Kubernetes Objects

### 8. What are Pods, Deployments, and Services in Kubernetes?

**Answer:**

**Pod:**
- Smallest deployable unit in Kubernetes
- Contains one or more containers
- Shares network and storage
- Ephemeral (recreated if fails)

**Deployment:**
- Manages Pods
- Provides rolling updates
- Handles scaling
- Ensures desired state

**Service:**
- Exposes Pods to network
- Provides stable IP and DNS
- Load balances traffic
- Types: ClusterIP, NodePort, LoadBalancer

**Example:**
```yaml
# Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80

---
# Service
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

### 9. What are ConfigMaps and Secrets in Kubernetes?

**Answer:**

**ConfigMap:**
- Stores non-sensitive configuration data
- Key-value pairs
- Can be mounted as files or environment variables

**Secret:**
- Stores sensitive data (passwords, tokens, keys)
- Base64 encoded (not encrypted)
- Should use external secret management in production

**Example:**
```yaml
# ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "postgresql://localhost:5432/mydb"
  log_level: "info"

---
# Secret
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  password: cGFzc3dvcmQxMjM=  # base64 encoded
```

---

## Best Practices

### 10. What are Docker and Kubernetes best practices?

**Answer:**

**Docker Best Practices:**
1. Use multi-stage builds
2. Minimize image layers
3. Use .dockerignore
4. Don't run as root
5. Use specific tags (not latest)
6. Keep images small

**Kubernetes Best Practices:**
1. Use resource limits
2. Implement health checks
3. Use namespaces
4. Secure secrets
5. Implement RBAC
6. Use ConfigMaps for configuration

---

## Summary

This guide covers essential Docker and Kubernetes interview questions including:

1. **Docker**: Containerization, images, containers, Dockerfile, volumes, Docker Compose
2. **Kubernetes**: Orchestration, pods, deployments, services, ConfigMaps, Secrets
3. **Best Practices**: Security, performance, scalability

Remember to understand both the concepts and practical implementations. Good luck with your interviews!

