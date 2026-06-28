# 🚀 PromptForge – AI Prompt Marketplace (Client-Side)

PromptForge is a cutting-edge, feature-rich Web Application designed as a premium marketplace for AI prompts. Users can seamlessly discover, purchase, bookmark, and sell high-quality prompt matrices tailored for popular AI engines like Midjourney, ChatGPT, DALL-E, and Stable Diffusion.

🌐 **Live Deployment Link:** [https://ai-prompt-client-woad.vercel.app](https://ai-prompt-client-woad.vercel.app)

---

## 🛠️ Complete Technical Stack & Architecture Details

This frontend architecture is engineered with Next.js for server-side optimizations, speed, responsiveness, modular scalability, and absolute state-driven security. Below are the core technologies utilized and why they were chosen:

### 1. Core UI & Next.js Framework Engine
* **Next.js (App Router):** The core foundation of our frontend framework. Chosen for its powerful Server-Side Rendering (SSR) and Incremental Static Regeneration (ISR) capabilities, which drastically improve SEO scores and initial page load speed. The App Router provides layout management, nested routing, and optimized component building out of the box.
* **Tailwind CSS:** Utilized for rapid, utility-first styling. It completely eliminates bulky custom CSS files and ensures a fully responsive grid system across mobile, tablet, and desktop viewports.
* **DaisyUI:** A premium component library built on top of Tailwind CSS. It provides pre-styled, accessible web components (modals, cards, navigation rails) that keep the application's aesthetic consistent.

### 2. Authentication & Secure Network Routing
* **Firebase Authentication:** Handles safe user sign-ins via Email/Password and Google OAuth. It mitigates the risk of client-side identity theft and offers seamless session maintenance.
* **JSON Web Tokens (JWT Client-Integration):** Works in tandem with Firebase. Once a user logs in, a cryptographic token is requested from our backend and stored securely inside the browser's LocalStorage or cookies to authorize private API interactions.

### 3. State Management & API Pipeline
* **TanStack Query (React Query):** Implemented to orchestrate server-state operations. It handles global automatic caching, background data refetching, and eliminates complex `useEffect` cycles for `/all-prompts` data fetching.
* **Axios:** A promise-based HTTP client config layer equipped with global Interceptors. These interceptors automatically attach the bearer token authorization headers (`Authorization: Bearer <token>`) to every premium transaction or secure dashboard request.

### 4. Advanced Ecosystem Implementations
* **React Stripe SDK (@stripe/react-stripe-js):** Embeds secure tokenized credit card input frames directly inside the checkout dashboard, ensuring zero PCI-compliance risk on our end while processing VIP platform upgrade logs.
* **Lucide React / React Icons:** Provides sleek, lightweight SVG-based iconography for intuitive dashboard layouts.

---

## ✨ Premium Platform Features

* 🎯 **Dynamic Prompt Marketplace:** Advanced multi-tier filter index allowing users to sort prompts by price matrices, popularity, category tags, and dynamic text-search fields.
* 💎 **VIP Forge Membership Upgrade:** Seamless Stripe-powered user state conversion from a basic user threshold to a premium global architect status.
* 📊 **Unified Workspace Dashboards:** Context-aware layouts tailored dynamically depending on whether a user holds a standard consumer status or an administrative command token.
* 🔖 **Interactive Client Sub-systems:** Features instant data-copy counters, interactive prompt-rating/review matrices, and bookmark indices.

---

## ⚙️ Local Installation Blueprint

Follow these steps to run the client-side system locally on your computer:

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/YOUR_GITHUB_USERNAME/YOUR_CLIENT_REPO.git](https://github.com/YOUR_GITHUB_USERNAME/YOUR_CLIENT_REPO.git)
    cd YOUR_CLIENT_REPO
    ```

2.  **Install Required Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variable Configurations:**
    Create a `.env.local` file in the root folder and append your unique development secrets:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_test_key_here
    ```

4.  **Boot Up the Development Server:**
    ```bash
    npm run dev
    ```