
# Food Sharing App - Comprehensive Overview

## Project Overview

The Food Sharing Application is a modern, microservices-based platform designed to facilitate seamless sharing of food recipes and ingredients. Built with a scalable and containerized architecture, the application leverages advanced cloud technologies and follows best practices for security, reliability, and maintainability.

---

## Architecture Highlights

### Key Features

- **Microservices Architecture**: Independent, decoupled services for modular functionality.
- **Containerized Applications**: All services are containerized using Docker for portability and consistency.
- **Kubernetes Orchestration**: Deployed and managed using Kubernetes (K8s) for high availability and scalability.
- **Message Queue Communication**: RabbitMQ is utilized for asynchronous communication between services.
- **Shared NPM Library**: A common library (`@gogittix/common`) for harmonized patterns such as error handling, authentication, and middleware.
- **RabbitMQ Broker Wrapper**: An additional published NPM package (`@anchordiv/rabbitmq-broker`) simplifies the use of RabbitMQ via a singleton wrapper.

---

## Microservices Overview

### **1. Auth Service**

**Purpose**: Handles user authentication and authorization.

- **Tech Stack**: Node.js, MongoDB
- **Message Queue**: Publishes user-related events to RabbitMQ.
- **Endpoints**:
  - `POST /signup`: Register a new user.
  - `POST /signin`: Log in an existing user.
  - `POST /signout`: Log out the user.
  - `GET /currentuser`: Fetch the authenticated user’s details.
  - `POST /change-password`: Update the user’s password.

---

### **2. Profile Service**

**Purpose**: Manages user profile details.

- **Tech Stack**: NestJS, PostgreSQL
- **Documentation**: Swagger for API documentation.
- **Endpoints**:
  - `POST /`: Create a new user profile.
  - `GET /:id`: Retrieve a profile by user ID.
  - `GET /email/:email`: Retrieve a profile by email.
  - `PATCH /:id`: Update profile details.
  - `DELETE /:id`: Delete a profile.
  - `POST /:id/image`: Upload a profile image.

---

### **3. Client Service (Frontend)**

**Purpose**: User-facing application interface.

- **Tech Stack**: Next.js (React Framework), Material UI, Shadcn UI, Tailwind CSS
- **Folder Structure**:
  - `app/`: Main application logic split into pages and components.
  - `hooks/`: Reusable custom hooks (e.g., `useSearch` for search functionality).
  - `components/`: Modular and reusable UI components.
  - `context/`: Context API for global state management (e.g., `SearchContext`).
  - `util/`: Utility functions for shared logic.

---

### **4. Recipe Service**

**Purpose**: Handles recipe-related operations.

- **Tech Stack**: Node.js, Express, PostgreSQL
- **Message Queue**: Listens to RabbitMQ for ingredient-related events.
- **Documentation**: Swagger for API documentation.
- **Endpoints**:
  - `GET /`: Retrieve all recipes.
  - `GET /:id`: Retrieve a specific recipe by ID.
  - `POST /`: Add a new recipe.
  - `PATCH /:id`: Update an existing recipe.
  - `DELETE /:id`: Remove a recipe.

---

### **5. Ingredient Service**

**Purpose**: Manages ingredient inventory.

- **Tech Stack**: NestJS, PostgreSQL
- **Documentation**: Swagger for API documentation.
- **Message Queue**: Consumes ingredient updates and handles dead-letter queues.
- **Endpoints**:
  - `POST /`: Create a new ingredient.
  - `GET /`: Retrieve all ingredients.
  - `GET /:id`: Fetch an ingredient by ID.
  - `PATCH /:id`: Update an ingredient.
  - `DELETE /:id`: Remove an ingredient.

---

## Shared Library

**Name**: [@gogittix/common](https://www.npmjs.com/package/@gogittix/common?activeTab=code)

- **Purpose**: Centralized repository for reusable patterns across services.
- **Key Features**:
  - Authentication Middleware (`requireAuth`, `currentUser`).
  - Custom Error Handling (e.g., `BadRequestError`, `NotAuthorizedError`).
  - RabbitMQ Broker Wrapper for message queue operations.

**Name**: [@anchordiv/rabbitmq-broker](https://www.npmjs.com/package/@anchordiv/rabbitmq-broker)

- **Purpose**: Simplifies RabbitMQ operations via a singleton wrapper.
- **Key Features**:
  - Easy initialization and queue setup.
  - Publish and consume messages efficiently.
  - Built-in dead-letter queue handling.

---

## Deployment Options

### AWS

1. **EKS (Elastic Kubernetes Service)**: For orchestrating Kubernetes workloads.
2. **RDS (Relational Database Service)**: Managed PostgreSQL instances for Recipe, Profile, and Ingredient services.
3. **S3 Buckets**: For storing profile images.
4. **IAM Roles**: Secure access to secrets via AWS Secrets Manager.

### Azure

1. **AKS (Azure Kubernetes Service)**: Kubernetes orchestration with seamless integration into Azure’s ecosystem.
2. **Azure PostgreSQL**: Fully managed relational database service.
3. **Blob Storage**: Profile image storage.
4. **Azure Active Directory**: Authentication and role management.

---

## Design Considerations

### Scalability

- Kubernetes ensures horizontal scaling.
- RabbitMQ allows for asynchronous processing and decoupled services.

### Security

- JWT-based authentication.
- Secure connections to RabbitMQ and databases.
- Use of HTTPS and secrets management (e.g., environment variables).

### Maintainability

- Decoupled services for modular development.
- Shared library for consistent patterns.
- Swagger documentation for clear API definitions.

---

## Roadmap

- **Integration Testing**: Ensure seamless communication between microservices.
- **Enhanced Search**: Add Elasticsearch for advanced query capabilities.
- **Cloud Agnostic Deployment**: Support for GCP in addition to AWS and Azure.
- **Deployment Pipelines**: Automate CI/CD with GitHub Actions and Kubernetes manifests.

---

## CI/CD (Jenkins)

Local dev Jenkins runs via Docker Compose. Staging and prod use Helm (Kubernetes) for consistency with production.

### Dev

```bash
docker compose -f infra/jenkins/docker-compose.dev.yaml up -d
```

Access: `http://localhost:8080/jenkins`

### Plugins (explicit install)

Dev Jenkins auto-installs only the plugins listed in `infra/jenkins/plugins.txt` on container start. Update that file to add/remove plugins, then restart the container to apply changes:

```bash
docker compose -f infra/jenkins/docker-compose.dev.yaml down
docker compose -f infra/jenkins/docker-compose.dev.yaml up -d
```

On the first Jenkins setup screen, choose **Select plugins to install** (not Install suggested plugins). Proceed without selecting any plugins; the curated list is installed automatically from `infra/jenkins/plugins.txt`.

Confirm plugins are installed:

- Jenkins UI: **Manage Jenkins → Plugins → Installed** and search for `kubernetes` or `docker-workflow`.
- CLI check: `scripts/ci/jenkins-plugins-status.sh jenkins-dev`

### Staging

Use Helm in the staging cluster with the chart in `infra/helm/jenkins`.

```bash
helm upgrade --install jenkins infra/helm/jenkins \
  --namespace jenkins \
  --create-namespace \
  -f infra/helm/jenkins/values-staging.yaml
```

### Required Jenkins credentials

- `docker-registry-creds` (DockerHub username/password)

---

## Getting Started

### Prerequisites

- Docker installed.
- Kubernetes cluster (local or cloud-based).
- MongoDB, PostgreSQL databases.
- RabbitMQ server.

### Running Locally

1. Clone the repository.
2. Build and run services:

   ```bash
   docker-compose up --build
   ```

3. Access services:
   - Auth: `http://localhost:3001`
   - Profile: `http://localhost:3002`
   - Recipe: `http://localhost:3003`
   - Ingredient: `http://localhost:3004`
   - Client: `http://localhost:3000`

### Kubernetes Deployment

1. Apply manifests:

   ```bash
   kubectl apply -f k8s/
   ```

2. Verify pods and services:

   ```bash
   kubectl get pods,svc
   ```

3. Access frontend via LoadBalancer or Ingress.

---

## NGINX Ingress Controller Configuration

The NGINX Ingress Controller is set up as the central point of entry to route traffic to appropriate services.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-service
  namespace: recipe
  annotations:
    nginx.ingress.kubernetes.io/use-regex: "true"
spec:
  ingressClassName: nginx
  rules:
    - host: example@domain.com
      http:
        paths:
          - path: /api/users/?(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: auth-service
                port:
                  number: 3000
          - path: /api/1/recipes/?(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: recipe-service
                port:
                  number: 3000
          - path: /api/1/profile/?(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: userprofile-service 
                port:
                  number: 3000
          - path: /api/1/ingredient/?(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: ingredient-service
                port:
                  number: 3000
          - path: /?(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: recipe-client-service
                port:
                  number: 3000
```

---

## Contributors

- **Project Lead**: Gabriel Odame

---

For any issues or feature requests, please open an issue on the GitHub repository.
