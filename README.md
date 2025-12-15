# 🏥 SuiCare: The Decentralized Health Ecosystem

![SuiCare Banner](Screenshot%202025-12-15%20115815.png)

> **Gamifying Wellness, Securing Medical Records, and Automating Insurance on the Sui Blockchain.**

[![Sui Network](https://img.shields.io/badge/Built%20On-Sui%20Network-4484f1)](https://sui.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)
[![Status](https://img.shields.io/badge/Status-Live%20Beta-orange)]()

## 📖 Overview

**SuiCare** is not just a patient app; it is a **complete healthcare infrastructure protocol**. We leverage the speed, low gas costs, and object-centric model of **Sui Move** to bridge the gap between physical health and digital assets.

In emerging markets, healthcare faces three critical failures:

1.  **Data Fragmentation:** Patients do not own their history; it is trapped in paper folders.
2.  **Counterfeit Drugs:** **1 in 10** medical products in developing nations is substandard or falsified.
3.  **Insurance Distrust:** Claim processes are slow, opaque, and prone to fraud.

**SuiCare solves this via a Multi-Role Ecosystem connecting Patients, Doctors, Labs, and Insurers.**

---

## 🚀 Key Features by Role

SuiCare provides tailored portals for every stakeholder in the healthcare journey.

### 👤 1. Patient Portal

- **Health Avatar NFT:** A dynamic "Lion" NFT that evolves (Cub → King) based on health actions (steps, checkups).
- **Medical Records Vault:** Own your data. Store encrypted history on IPFS, linked to on-chain metadata.
- **Telemedicine:** Book appointments with SUI. Funds are held in **Escrow** until the consult is done.
- **Data DAO:** Stake anonymized records to Research Pools and earn SUI rewards.
- **Emergency Guardians:** "Break-Glass" access for family members via multi-sig logic.

### 🩺 2. Doctor Portal

- **Verified Issuer:** Mint immutable **"Verified Diagnosis"** and **"Prescription NFTs"** directly to a patient's wallet.
- **Access Request:** Request temporary permission to view a patient's encrypted history.
- **Earnings Wallet:** Real-time visualization of SUI earnings from consultations.

### 🔬 3. Lab & Pharmacy Portal

- **PharmaGuard:** A supply chain verification tool. Scan drug batch codes to verify authenticity against the on-chain Registry.
- **Prescription Fulfillment:** "Burn" or mark Prescription NFTs as used to prevent double-spending of medication.
- **Inventory Management:** Track verified stock levels on-chain.

### 🏢 4. Insurer Portal

- **AI Fraud Detection:** Claims are scored (0-100%) based on the presence of "Verified Records" from trusted Doctors/Labs.
- **Automated Payouts:** Smart contract logic executes instant SUI transfers for approved claims.
- **Parametric Rules:** Deploy oracle-based rules (e.g., "If Lab Result = Positive Malaria, Pay 50 SUI").

---

## 🏗️ Technical Architecture

SuiCare is a full-stack dApp built with **React (Vite)** and **Sui Move**.

### Smart Contracts (`suicare-backend`)

We utilize Sui's **Object-Centric Data Model** to handle ownership and access control.

| Object Type      | Ownership Model | Description                                                             |
| :--------------- | :-------------- | :---------------------------------------------------------------------- |
| `HealthRecord`   | **Owned**       | Transferable object containing encrypted IPFS CID and issuer signature. |
| `HealthAvatar`   | **Owned**       | Dynamic NFT with mutable fields (`level`, `xp`) updated by logic.       |
| `InsuranceVault` | **Shared**      | A treasury pool that accepts premiums and pays out claims.              |
| `Appointment`    | **Shared**      | Escrow object holding funds between Patient and Doctor.                 |
| `DrugRegistry`   | **Shared**      | A global table mapping `BatchID` -> `Manufacturer` for verification.    |
| `AdminCap`       | **Owned**       | Capability required to verify Labs and approve high-value claims.       |

### Frontend (`client`)

- **Framework:** React + TypeScript + Vite
- **State Management:** Local React Hooks + `@mysten/dapp-kit` Query Hooks.
- **Styling:** Tailwind CSS for a responsive, mobile-first UI (down to 320px).
- **Authentication:** **zkLogin** (Google) for non-crypto natives & standard Wallet Connect.

---

## ⚙️ Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install)
- Sui Wallet Extension

### 1. Smart Contract Deployment

```bash
cd suicare-backend
sui move build
sui client publish --gas-budget 100000000 --skip-fetch-latest-git-deps
```

````

_Copy the **Package ID** and **Shared Object IDs** from the output._

### 2\. Frontend Setup

```bash
cd client
npm install
```

### 3\. Configuration

Open `client/src/constants.ts` and update with your deployed IDs:

```typescript
export const NETWORK = "testnet";
export const PACKAGE_ID = "0x..."; // Your Package ID
export const INSURANCE_VAULT_ID = "0x...";
export const DRUG_REGISTRY_ID = "0x...";
```

### 4\. Run Locally

```bash
npm run dev
```

Access the app at `http://localhost:5173`.

---

## 🧪 The "Golden Flow" (Demo Walkthrough)

To test the full capability of SuiCare, follow this sequence:

1.  **Login:** Connect Wallet via the Landing Page. Select **"Patient Portal"**.
2.  **Gamification:** Go to Dashboard -\> Click **"Mint Lion Cub"**. See your NFT appear.
3.  **Doctor Interaction:** Switch account or Logout. Login as **"Doctor"**.
    - Go to **"Issue Record"**.
    - Enter Patient Address. Mint a "Verified Diagnosis".
4.  **Patient Verification:** Log back in as **Patient**.
    - Go to **"Medical Records"**.
    - See the new record marked with a **Green Verified Badge**.
5.  **Insurance Claim:** Go to **"Insurance"**.
    - File a claim citing the new record.
6.  **Insurer Approval:** Logout. Login as **"Insurer"**.
    - See the claim in the "Pending Queue".
    - Click **"Pay"** to execute the on-chain payout.

---

## 🔮 Future Roadmap

- **Q1 2025:** Mainnet Launch & Token Generation Event ($CARE).
- **Q2 2025:** Mobile App (React Native) for rural access.
- **Q3 2025:** On-chain Pharmacy Inventory Protocol (B2B).
- **Q4 2025:** AI Doctor integration using Zero-Knowledge Proofs (zkML) on private patient data.

---

## 🤝 Contributing

We welcome contributions\! Please open an issue or submit a PR.

## 📄 License

This project is licensed under the MIT License.

---

**Built with 💙 by the SuiCare Team.**
````
