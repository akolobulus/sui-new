# 🏥 SuiCare: The Decentralized Health Super-App

![SuiCare Banner](https://via.placeholder.com/1200x300.png?text=SuiCare+Health+Ecosystem)

> **Gamifying Wellness, Securing Records, and Monetizing Health Data on the Sui Blockchain.**

## 📖 Overview

**SuiCare** is a holistic Web3 healthcare ecosystem built on the **Sui Network**. It solves critical issues in the healthcare industry—fragmented medical records, counterfeit drugs, and lack of patient data ownership—by leveraging the speed, low cost, and object-oriented nature of Sui Move.

SuiCare empowers patients to own their history, verify their medication, earn from their data, and access care instantly.

---

## 🚀 Key Features

### 1. 🩺 Telemedicine Marketplace

- **Direct Booking:** Patients find verified doctors and book consultations.
- **Escrow Payments:** Consultation fees are held in a smart contract escrow and only released when the session is complete.
- **Instant Refunds:** Patients can cancel before the appointment starts and receive an immediate refund.

### 2. 🦁 Health Avatar (Gamification)

- **Dynamic NFT:** A "Lion" avatar that acts as a visual representation of your health journey.
- **Evolution Mechanics:** The avatar evolves from a **Cub** to a **King** (Level 1 → 4) as users perform healthy actions (uploading records, verifying drugs).
- **On-Chain Metadata:** Level and XP are stored directly on the Avatar object.

### 3. 💰 Data DAO (Research Marketplace)

- **Monetize Data:** Patients stake anonymized medical records into a **Research Pool**.
- **Earn Rewards:** Researchers fund the pool with SUI to access aggregate data; users claim SUI rewards proportional to their staked records.
- **Privacy First:** Users retain ownership; only the access right is staked.

### 4. 🛡️ Emergency Guardians ("Break Glass")

- **Delegated Access:** Users designate trusted family members as "Guardians".
- **Guardian Pass:** A specialized NFT is minted to the Guardian's wallet, granting them read-access to critical bio-data (Blood Type, Allergies) if the patient is incapacitated.

### 5. 💊 PharmaGuard (Drug Verification)

- **Anti-Counterfeit:** Users verify medicine authenticity by entering a batch number.
- **Supply Chain Tracking:** The smart contract checks the `DrugRegistry` to ensure the batch was minted by a verified manufacturer.

### 6. ⚡ Automated Parametric Insurance

- **Smart Policies:** Users buy policies (Device, Health, Travel).
- **Instant Claims:** Logic to handle claims and payouts transparently on-chain.

---

## 🛠️ Tech Stack

- **Blockchain:** Sui Network (Testnet)
- **Smart Contract Language:** Move
- **Frontend Framework:** React (Vite) + TypeScript
- **Styling:** Tailwind CSS + Lucide Icons
- **Wallet Integration:** `@mysten/dapp-kit` (Sui Wallet, zkLogin)
- **Charting:** Recharts

---

## 🏗️ Technical Architecture

### Smart Contract Structure (`vault.move`)

The core logic is contained within the `suicare::vault` module.

#### Key Structs (Sui Objects)

| Struct             | Type          | Description                                                |
| :----------------- | :------------ | :--------------------------------------------------------- |
| `HealthRecord`     | Owned Object  | Stores medical details, doctor info, and IPFS CID.         |
| `HealthAvatar`     | Owned Object  | The dynamic NFT (Level, XP, Image URL).                    |
| `InsurancePolicy`  | Owned Object  | Represents an active insurance plan with coverage details. |
| `Appointment`      | Shared Object | Manages the booking state and holds SUI in Escrow.         |
| `EmergencyProfile` | Shared Object | Publicly accessible bio-data (Blood type, Allergies).      |
| `GuardianPass`     | Owned Object  | An NFT key held by a guardian to access profiles.          |
| `ResearchPool`     | Shared Object | Holds SUI funds donated by researchers.                    |
| `DataStake`        | Owned Object  | A receipt representing a staked record.                    |

### Data Flow Example: Telemedicine

1.  **Book:** Patient calls `book_appointment`. SUI is split from gas and moved into the `Appointment` object (Escrow).
2.  **Wait:** Appointment status is `0` (Active).
3.  **Complete:** Patient calls `release_funds`. SUI is transferred to the Doctor.
4.  **Cancel:** Patient calls `cancel_appointment`. SUI is transferred back to Patient.

---

## ⚙️ Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install)
- Sui Wallet Extension (Browser)

### 1. Backend (Smart Contract)

```bash
# Navigate to move folder
cd suicare-backend

# Build the contract
sui move build

# Publish to Testnet
sui client publish --gas-budget 100000000 --skip-fetch-latest-git-deps
```

**⚠️ Important:** After publishing, copy the **Package ID** and the Shared Object IDs (Insurance Vault, Research Pool, Drug Registry) from the console output.

### 2\. Frontend (Client)

1.  Navigate to the client folder:

    ```bash
    cd client
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  **Update Constants:**
    Open `client/src/constants.ts` and paste your new IDs from the backend deployment:

    ```typescript
    export const PACKAGE_ID = "0x...";
    export const INSURANCE_VAULT_ID = "0x...";
    export const RESEARCH_POOL_ID = "0x...";
    export const DRUG_REGISTRY_ID = "0x...";
    ```

4.  Run the development server:

    ```bash
    npm run dev
    ```

5.  Open `http://localhost:5173` in your browser.

---

## 🧪 Testing the App (Golden Flow)

1.  **Connect Wallet:** Switch Sui Wallet to **Testnet** and connect.
2.  **Mint Avatar:** Go to Dashboard -\> Click **"Mint Lion Cub"**.
3.  **Create Profile:** Go to "Emergency Guardians" -\> Fill details -\> **"Save Profile"**.
4.  **Add Record:** Go to "Medical Records" -\> **"Add Record"**.
5.  **Stake Data:** Go to "Monetize Data" -\> Click **"Stake"** on your new record.
6.  **Level Up:** Go back to Dashboard -\> Click **"Train"**. Watch your Lion evolve\!

---

## 🔮 Roadmap

- **Phase 1 (MVP):** Testnet deployment, Core 5 features, Avatar System. (✅ Completed)
- **Phase 2:** Mainnet launch, Mobile App Wrapper, zkLogin optimization for non-crypto users.
- **Phase 3:** Partnership with local pharmacies for PharmaGuard integration.
- **Phase 4:** AI Doctor Assistant integration using on-chain history.

---

## 📄 License

This project is licensed under the MIT License.

---

**Built with 💙 on Sui.**
