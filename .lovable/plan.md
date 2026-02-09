
# Smart Estate Planning App for Individuals

An interactive estate planning tool that matches the Pyle Financial Services branding, featuring the Periodic Table of Estate Planning Elements and a personalized recommendation engine.

## Branding & Design
- Match the Pyle Financial Services website look and feel — professional, clean financial services aesthetic
- Color scheme based on the periodic table: dark blue (Charitable), teal/green (Personal), and orange (Qualified Planning Tools)
- Professional typography and polished card-based layouts

## Pages & Features

### 1. Landing Page
- Hero section introducing the estate planning tool
- Brief explanation of the three planning categories (Charitable, Personal, Qualified)
- Call-to-action to explore the periodic table or start a personalized assessment

### 2. Interactive Periodic Table
- Faithful recreation of the "Periodic Table of Estate Planning Elements™" as a clickable grid
- Color-coded by category (blue, teal, orange)
- Clicking any element opens a detail panel with:
  - Full name and description of the strategy
  - Who it's best suited for
  - Key benefits and considerations
- Filter/search capability to narrow down strategies

### 3. Personal Assessment Wizard
- Multi-step form collecting:
  - **Income & Assets**: Annual income, net worth, asset types (real estate, investments, business interests, etc.)
  - **Goals & Priorities**: Tax reduction, wealth transfer to heirs, charitable giving, asset protection
  - **Existing Plans**: Current trusts, insurance policies, retirement accounts already in place
- Progress bar showing completion status

### 4. Personalized Recommendations Dashboard
- Based on user inputs, show recommended strategies from the periodic table
- Each recommendation includes a description, why it's relevant, and estimated tax savings
- Strategies organized by category with priority levels
- Ability to save and revisit recommendations

### 5. User Accounts & Profile
- Sign up / login (email-based authentication via Lovable Cloud)
- User profile storing financial information
- Saved assessments and recommendation history
- Ability to update inputs and re-run recommendations

## Backend (Lovable Cloud)
- User authentication and profiles
- Database to store user financial inputs and saved recommendations
- Edge function for the recommendation logic (matching user profiles to relevant strategies)
