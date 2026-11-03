# Fiserv Payment Interview Questions and Answers

This guide is for candidates preparing for payment technology roles at Fiserv. It covers payment-processing fundamentals, integration and reliability topics, and a few Fiserv product context questions. Exact systems and workflows vary by product, region, payment method, and role; use public product documentation and the job description for platform-specific preparation.

## Table of Contents

1. [Company and Product Context](#company-and-product-context)
2. [Payment Processing Fundamentals](#payment-processing-fundamentals)
3. [Integration and Reliability](#integration-and-reliability)
4. [Security and Risk](#security-and-risk)
5. [System Design and Scenarios](#system-design-and-scenarios)

---

## Company and Product Context

### 1. What does Fiserv do?

Fiserv provides technology and services to financial institutions, businesses, and merchants. Its offerings include payment processing and acceptance, digital banking, and financial technology products. The exact product area relevant to an interview depends on the role.

### 2. What is Clover?

Clover is Fiserv's point-of-sale and business-management platform for merchants. It combines payment acceptance with hardware, software, and integrations. In an interview, connect a Clover-related role to the needs of merchants, such as reliable checkout, transaction visibility, device management, and integrations, rather than assuming every role uses the same architecture.

### 3. What should you learn about the Fiserv product named in a job description?

Identify its customers, supported payment channels, integration model, and the team's responsibilities. Review current public documentation and distinguish what you know from what you would verify with the team. Fiserv's portfolio is broad, so do not assume that one product's API or transaction lifecycle applies to another.

## Payment Processing Fundamentals

### 4. Describe a typical card payment from checkout to settlement.

A merchant or payment application collects transaction details and sends an authorization request through its processor/acquirer and the card network to the issuer. The issuer approves or declines the request. Approved transactions are later captured or submitted for clearing; funds are then settled between participants according to their agreements and schedules. The exact participants and message flow vary by channel and processing model.

### 5. What is the difference between authorization, capture, clearing, and settlement?

- **Authorization** asks the issuer to approve a transaction and typically places a hold on available funds.
- **Capture** confirms that an authorized transaction should be completed, often after goods ship or a service is delivered.
- **Clearing** exchanges transaction records and determines the amounts owed between participants.
- **Settlement** transfers funds between financial institutions; merchant funding may happen on a separate schedule.

Some systems combine or automate steps, but the concepts remain distinct.

### 6. What is the difference between a void, reversal, and refund?

A void or reversal attempts to cancel an authorization or transaction before it is fully settled, depending on the processor's lifecycle and timing. A refund is a new transaction that returns some or all of a previously captured payment. Terminology and permitted operations vary by processor, so confirm the platform's API semantics and transaction state rules.

### 7. What is an acquirer, issuer, and payment network?

The **acquirer** serves the merchant and routes transactions for acceptance. The **issuer** provides the cardholder's payment account and makes the authorization decision. The **payment network** routes messages and defines rules and message formats between participants. In practice, processors and service providers may perform parts of these roles or connect systems on their behalf.

### 8. What is ISO 8583?

ISO 8583 is a family of message formats used for card-originated financial transaction messages. A message commonly includes a message type indicator, a bitmap describing which data elements are present, and data elements carrying transaction details. Implementations and network profiles differ, so field meanings, formats, and required values must be confirmed against the applicable specification rather than assumed from a generic example.

### 9. What are interchange and merchant discount?

Interchange is a fee associated with transactions between the acquirer and issuer, with rates influenced by factors such as card type, transaction data, and applicable network rules. A merchant discount or processing fee is the amount charged to the merchant under its agreement and can include multiple cost components. Avoid treating these terms as interchangeable or assuming one universal pricing model.

## Integration and Reliability

### 10. How would you make a payment API safe to retry?

Use an idempotency key scoped to the merchant and payment operation. Persist the key with a request fingerprint and final result, enforce uniqueness atomically, and return the original result for a matching retry. Reject reuse with a different payload. Also define key retention, concurrency behavior, and what happens when the upstream processor's result is unknown.

### 11. How should a client handle a payment timeout?

A timeout does not prove that the payment failed; the processor may have completed it while the response was lost. The client should query the transaction by a stable reference or retry with the same idempotency key, then reconcile the result before attempting a new charge. Never blindly create a second payment after an ambiguous response.

### 12. How would you design webhook handling for payment events?

Verify the event's signature and timestamp, deduplicate using a stable event identifier, and persist the event before acknowledging receipt. Process it asynchronously and make handlers idempotent because delivery may be repeated or out of order. Provide retry handling, dead-letter visibility, and a way to retrieve or reconcile missed events.

### 13. How do you reconcile transactions?

Compare transaction records from the merchant or application with processor reports and settlement or funding records. Match using stable identifiers, amount, currency, and relevant dates; account for partial captures, refunds, fees, and timing differences. Put unmatched or inconsistent records into an exception workflow with traceable investigation and correction steps.

### 14. How would you handle processor errors and outages?

Classify errors as retryable, terminal, or ambiguous. Apply bounded retries with exponential backoff and jitter only when safe, use idempotency for retryable writes, and avoid retry storms through timeouts and circuit breakers. Monitor authorization success, latency, error rates, and queue age. Any failover strategy must respect routing rules and transaction state so it does not duplicate or misroute payments.

## Security and Risk

### 15. What is PCI DSS, and how can an application reduce its card-data scope?

PCI DSS is a security standard for environments that store, process, or transmit payment card data. Minimize scope by avoiding storage of sensitive authentication data, using hosted payment fields or a provider's tokenization solution where appropriate, restricting access, and keeping secrets out of logs. Tokenization can reduce exposure but does not automatically remove all PCI responsibilities; confirm scope with the organization's compliance team and assessor.

### 16. What is tokenization?

Tokenization replaces a sensitive payment credential with a substitute value that can be used by authorized systems for defined operations. The token's usage depends on its provider, merchant or customer scope, and channel. Treat tokens as sensitive, apply access controls, and understand lifecycle events such as expiry, account updates, and token revocation.

### 17. How do 3-D Secure and fraud controls fit into e-commerce payments?

3-D Secure adds an authentication flow between the customer, merchant, and issuer for eligible online transactions. Fraud controls can also evaluate signals such as device, transaction history, and velocity. These mechanisms can affect customer friction, approval rates, and liability outcomes; apply them according to the product, region, network rules, and risk policy.

## System Design and Scenarios

### 18. Design a payment service for an online checkout.

Start with a clear transaction state model and API contract. Persist each payment attempt and its idempotency key, then coordinate with the processor without holding a database transaction open across a network call. Handle ambiguous outcomes through status lookup and reconciliation. Publish state changes through an outbox or equivalent reliable mechanism, protect card data, and instrument latency, declines, errors, and settlement discrepancies.

### 19. A customer was charged but the order still shows unpaid. How do you investigate?

Trace the order ID, payment ID, idempotency key, and processor reference across application logs and payment records. Check whether the authorization or capture succeeded, whether a webhook was delayed or dropped, and whether an update failed after the processor response. Reconcile with processor records, repair the order state through an auditable process, and ensure the fix cannot create another charge.

### 20. What would you ask when clarifying a payment-processing requirement?

Clarify payment channel and methods, authorization and capture timing, partial shipments or captures, refunds and reversals, currencies and regions, expected volume and latency, idempotency and timeout behavior, fraud and authentication requirements, settlement and reconciliation needs, and operational ownership. Confirm which requirements are product-specific and which are controlled by networks, regulations, or merchant agreements.

## Interview Preparation

Be ready to explain a payment flow end to end, discuss a production issue you investigated, and describe how you handle ambiguous outcomes without duplicating a charge. For product-specific questions, refer to current public Fiserv documentation and the role description; do not present assumptions about proprietary systems as facts.
