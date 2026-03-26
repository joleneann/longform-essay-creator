# Growth Engineering in Practice: 2025-2026 Raw Research Notes

Research conducted: 2026-03-26
Sources: 15+ web searches, 10+ article deep-reads across LinkedIn, Reddit, practitioner blogs, job postings, company engineering blogs, and industry analyses.

---

## 1. WHAT GROWTH ENGINEERS ACTUALLY DO DAY-TO-DAY

### From PostHog (Ian Vanagas, "How to Think Like a Growth Engineer")
- Growth engineers let metrics be their "north star" rather than planning roadmaps months ahead
- They prioritize whatever improves key business indicators: signup conversion, activation, retention
- Everything is an experiment. They favor rapid iteration and "good enough" solutions that can be tested and discarded
- They develop testable hypotheses and validate through small-scale experiments BEFORE investing engineering resources
- Establish tracking for activation (users reaching the product's "aha moment") and retention, monitoring weekly and correlating changes with shipped work
- Validate ideas with minimal investment. Example: MasterClass tested tiered pricing by showing tiers at checkout, then reverting to existing pricing, saving months of engineering time ("fake door test")
- Ensure sufficient sample sizes, test for one week minimum, track counter-metrics alongside primary goals, use feature flags for proper participant splitting
- At companies like Google, 80-90% of experiments "fail," yet the successful 10-20% generate substantial returns

### From Pragmatic Engineer (Gergely Orosz, deep-dive article)
- **Origin story**: Growth engineering started at Facebook in 2007 under Chamath Palihapitiya. When asked what to call this hybrid role: "I don't know, I just call that, like, Growth, you know, we're going to try to grow."
- **Three types of work**:
  1. **Business-facing work**: Implementing ideas, quantifying impact through A/B testing, analyzing results, iterating. Ranges from small tests (pricing display framing) to large ones (checkout flow optimization)
  2. **Empowerment work**: Building tools or integrating MarTech so marketing teams can iterate independently without engineering bottlenecks
  3. **Platform work**: Creating reusable systems like experiment platforms, standardized UI components, business metric monitoring to improve team velocity
- **"Tent vs. skyscraper" philosophy**: Growth engineers prioritize speed and learning over longevity. Deliberately take shortcuts inappropriate for long-term systems, use lightweight approaches, accept reduced code coverage when compensated by robust monitoring
- **Fundamental mindset**: "Product Engineering teams ship to build; Growth Engineering teams ship to learn."
- **Real-world example (MasterClass Pricing)**: The growth team wanted to test multi-tier pricing but faced months of complex backend work. Instead, they created a "Fake Door Test" offering unappealing pricing tiers during checkout, then "upgrading" customers to better rates. Required only days of frontend work while gathering critical revenue data.
- **When companies need growth teams**: Series B stage or beyond. At least $5M recurring revenue to justify ~$1M annual team costs. Need sufficient product-market fit and user traffic for meaningful A/B testing.
- **Major companies with growth teams**: Meta, LinkedIn, DoorDash, Coinbase, Dropbox, OpenAI, Uber, TikTok, Tinder, Airbnb, Pinterest

### From Atlassian Engineering Blog
- Growth engineers at Atlassian focus on "discovering and unlocking customer value in existing product offerings" rather than building new products
- They embrace "Progress over Perfection"
- Product teams answer "What product do we need to build?" Growth teams focus on "Why aren't users sticking around?"
- Growth projects typically span shorter timeframes (rarely exceeding three months) with smaller technical scope than product or platform teams
- **Specific example (Jira Project Pages)**: The Growth team built an experimental feature linking Confluence spaces to Jira projects through A/B testing. After positive results, they enrolled every Jira customer in final experiments, eventually rolling out to 100% of users with measurable Confluence engagement increases
- Work across multiple codebases, partnering with PMs, Designers, and other engineers
- "Growth engineers' work lives or dies by the customer impact it has."
- Teams are data-INFORMED, not purely data-driven: balance quantitative metrics with qualitative customer research

### From Jeff Chang's Growth Engineering Blog (ex-Pinterest)
- Recommends "bottoms up instead of top down" organization
- An "atomic growth team" = PM paired with engineer-designer building pairs who own the full experiment lifecycle from ideation through execution
- No fixed PM-to-engineer-to-designer ratio; composition depends on team needs
- Growth team members usually have multiple roles; all three positions (PM, engineer, designer) equally critical
- "Not being blocked is key to optimizing growth team velocity": engineers might create mockups rather than waiting for polished designs
- Seniority shows surprisingly little correlation with impact; junior engineers frequently succeed because many growth opportunities aren't technically complex
- Growth engineers need: technical ability to launch multiple weekly experiments independently, basic data analysis skills, capacity to learn and improve idea evaluation
- Growth designers are the hardest role to fill

### From Specific Activation/Onboarding Experiments (2024-2025)
- **Dashboard Templates**: Adding a dashboard template to onboarding flow to boost activation
- **Video-Assisted Forms**: 12-second loom-style video above a form increased activation from 28% to 46% in 2 weeks
- **CLI-Based Onboarding**: Replaced 6-step product tour with single "Run this CLI copy-paste" command, achieving 33% activation lift
- **Weekly cycle pattern**: Monday pull metrics, Tuesday flag anomalies, Wednesday ideate experiments, Thursday launch, Friday share learnings

---

## 2. TOOLS AND TECHNOLOGIES

### Experimentation Platforms (the big shift in 2025)
- **Statsig**: Acquired by OpenAI for $1.1B in September 2025. Most advanced experimentation engine with sequential testing, stratified sampling, CUPED, switchbacks, instant flag-to-test conversion. Charges only for analytics events; feature flags are free. Vijaye Raji (Statsig founder) became OpenAI's CTO of Applications.
- **Eppo**: Acquired by Datadog for $220M in May 2025. Warehouse-native architecture, integrates directly with data warehouses (Snowflake, Redshift). Best for data-mature organizations with dedicated data science teams. Now "Eppo by Datadog" with real-time observability metrics creating new experiment diagnostics. Statistical canary testing automated based on errors, infra metrics, and product telemetry.
- **LaunchDarkly**: Enterprise-grade feature flagging with basic experimentation. Best for large engineering teams managing hundreds of features. Dual charging model can cost 50-80% more than alternatives.
- **GrowthBook**: Open-source option
- **Optimizely**: Long-standing player, ran 127,000+ experiments across customers
- **PostHog**: All-in-one: CDP, Web Analytics, Product Analytics, feature flags, A/B tests, session replay

### The Experimentation Platform Consolidation of 2025
Two major acquisitions reshaped the space:
1. OpenAI + Statsig ($1.1B): Signals that experimentation infrastructure is critical to AI product development. As Sequoia noted: "AI can create infinite variations, but the harder problem is figuring out which one works."
2. Datadog + Eppo ($220M): Experimentation moving into the observability stack. Full end-to-end product analytics where engineers track code changes with feature flags, data scientists design and measure experiments, business analysts understand product usage.

### Tech Stack for Growth Engineering (from Pragmatic Engineer)
- Experiment platforms (in-house or Eppo, Statsig)
- Monitoring systems for business metrics and campaign performance
- Feature flags for rapid iteration and rollback
- Product analytics tools
- MarTech integrations (email, SMS, push notification platforms)
- Review apps for quick testing
- Reusable components (Storybook) to reduce design iteration cycles

### What Growth Engineers Actually Code
- Full-stack: React, Next.js, TypeScript/JavaScript, HTML/CSS (frontend) + Python, Django, APIs (backend)
- Growth infrastructure: web systems, onboarding flows, automation pipelines, referral engines
- Own the stack behind public-facing websites, landing pages, analytics systems, growth-related APIs
- Daily coding: debug checkout flows, write API endpoints, review PRs touching frontend and backend, examine database queries, update deployment configs

---

## 3. METRICS GROWTH ENGINEERS OWN

### Core Framework: AARRR (Pirate Metrics)
- **Acquisition**: How users find you
- **Activation**: Rate at which users reach "aha moment," time-to-value, product stickiness, feature adoption rate
- **Retention**: Customer churn rate, net churn (more useful than gross churn for SaaS)
- **Revenue**: Customer acquisition cost (CAC), customer lifetime value (CLV), return on ad spend (ROAS)
- **Referral**: Viral coefficient, referral conversion rates

### Product-Qualified Leads (PQLs)
- Typically activated users who completed a key action, had their aha moment, experienced product value firsthand

### From the Alexey Test
- Teams need metrics WITHIN their control
- Seasonality requires adjusting targets (e.g., "landing page to purchase conversion" rather than raw "revenue")
- Teams working across other departments' codebases face political friction outweighing engineering productivity

### LLM-Era Growth Metrics (2025)
- Experiment velocity (tests per sprint; days to launch)
- Personalization lift (open/click-to-lead improvements)
- Content throughput (assets per FTE)
- Decision latency (weekly reporting cycles)
- Attributable pipeline/revenue impact

---

## 4. HOW THE ROLE DIFFERS FROM REGULAR ENGINEERING

### Key Differences (multiple sources)
| Dimension | Product Engineering | Growth Engineering |
|-----------|--------------------|--------------------|
| Primary goal | Build features worth paying for | Make a good product have a good business |
| Scope | Own a specific product area | Work across products and codebases |
| Mindset | Ship to build | Ship to learn |
| Code philosophy | Skyscraper (built to last) | Tent (built to validate, then rebuild or discard) |
| Project duration | Months to quarters | Days to weeks (rarely >3 months) |
| Test coverage | High coverage expected | Reduced coverage acceptable with robust monitoring |
| Velocity | Feature-driven cadence | Experiment-driven cadence (weekly launches) |
| Failure rate | Low tolerance | 80-90% of experiments expected to fail |
| Success metric | Product quality, user satisfaction | Measurable business metric lift |

### From Phiture (Andy Carvell)
- Product engineering builds "what exists"; growth engineering builds "how it spreads"
- Separate roadmaps recommended even in small teams
- Both compete for limited engineering resources (a key tension)
- Growth activities don't always require engineering: content marketing, lifecycle campaigns, community engagement can operate independently

### From Elena Verna
- Growth engineering is "the most frequently failed step" in scaling growth teams
- Common failure modes: operating too slowly like Core Engineering, getting caught up in mundane tasks, gridlock from dependencies, overdeveloping projects, lacking inspiration
- Success factors: first hire should set up no-code/self-serve tooling for PMs and Marketing, culture of scrappiness, avoid transitioning Core Engineers to Growth (wrong mindset), hire Growth Engineers NOT influenced by "complexity is beautiful" culture

---

## 5. HOW AI HAS CHANGED THE WORK (2025-2026)

### LLM-Powered Growth Experimentation
- LLMs accelerate hypothesis creation, test design, and asset generation
- Teams run more, better experiments per sprint
- LLMs draft and QA assets, assemble variants, interpret metrics, propose next-best actions
- Measurable outcomes: more tests shipped per sprint, deeper personalization without extra load, faster time-to-insight

### Context: Budget Pressures
- Gartner's 2025 CMO Spend Survey: marketing budgets at 7.7% of revenue, flat
- New headcount is scarce; LLM automation helps teams accomplish more with existing resources
- Sales wants higher-quality opportunities, finance wants provable ROI, product wants faster learning loops

### AI Coding Assistants Impact on Growth Engineers
- GitHub Copilot: 20M+ cumulative users by July 2025, generating 46% of code written by developers
- Pull request time dropped from 9.6 days to 2.4 days (75% reduction)
- DX Q4 2025: 91% AI adoption, 22% of merged code is AI-authored
- Growth engineers specifically benefit because their work is high-velocity, experiment-heavy, and crosses many codebases

### AI-Native Experimentation (Emerging)
- AI can create infinite content/design variations; experimentation platforms determine which works
- Eppo by Datadog: statistical canary testing automated based on errors, infra metrics, product telemetry
- Small changes to LLM models, prompts, or UI elements can have big, unpredictable effects on user behavior; experimentation is now essential for AI products

### Governed AI Workers for Growth Teams
- Task-specific automation integrated with existing tools, bound by compliance policies, grounded in company data
- Not generic chatbots; specific workflow automation
- McKinsey: generative AI could lift marketing productivity by 5-15% of total spend when embedded into workflows

### Agentic AI and Growth (2025-2026)
- 57.3% of organizations now have AI agents in production (LangChain survey)
- Multi-agent systems: 1,445% surge in inquiries (Gartner, Q1 2024 to Q2 2025)
- Agent-to-Customer interaction: agents as "Brand Twins" maintaining persistent memory of customer preferences
- Model Context Protocol (MCP) emerged in 2025 as universal protocol for AI-native APIs

---

## 6. PAIN POINTS AND DEBATES

### Common Pain Points
- **Speed vs. quality tradeoffs**: The classic tension every growth engineering team contends with. Engineers interested in experiment hypotheses and growth goals were most engaged.
- **Code quality perception**: Other software engineers remain skeptical of growth engineering due to perceptions of hacky code with minimal test coverage. Growth teams actively counter this through better monitoring and platform standards.
- **Finding the right people**: Growth engineering is one of the most underappreciated roles because it's so hard to find the right people and they're so critical to success.
- **Dependencies and gridlock**: Growth teams working across other departments' codebases face political friction.
- **Overdevelopment**: Growth teams that operate like core engineering teams (building skyscrapers when they need tents) fail.
- **Legacy tech platforms**: Systems designed for smaller volumes struggle with performance, integration, and data accuracy at scale.
- **Hiring pipeline**: 58% of employers admitted hiring processes were taking longer than usual in 2024, causing candidate drop-off (1/3 of best applicants lost to slow processes).
- **Mental health**: High-intensity, rapid-iteration work can lead to burnout. One practitioner (Michael Taylor) experienced a breakdown from overwork intensity.
- **Growth designer scarcity**: The hardest role to fill on growth teams.

### Debates
- **Build vs. buy experimentation platforms**: In-house gives flexibility but is expensive to maintain. Vendor consolidation (Statsig to OpenAI, Eppo to Datadog) is reshaping the buy landscape.
- **When to start a growth team**: Need PMF first. B2B companies with insufficient traffic may lack statistical power for experiments, making dedicated growth teams premature. At least $5M ARR recommended.
- **Experiment volume vs. quality**: Impact per test peaks at 1-10 annual tests per engineer; beyond 30 tests per engineer, expected impact drops by 87%. Running more isn't always better.
- **Information leakage from experiments**: Companies expose experiment configurations via API routes (Lyft serves 180KB JSON with 1,449 client variables; Pinterest has 823 active experiments visible via API). Competitors can reverse-engineer strategic direction from unobfuscated experiment names.

---

## 7. ORG STRUCTURE (WHERE GROWTH SITS)

### Reporting Lines
- Growth teams have transitioned from reporting to marketing/sales to reporting directly to CEO
- Multiple models exist:
  1. Report to a functional head (Product, Marketing, Engineering)
  2. Matrixed: Growth PM reports into Product, etc., but work together as growth team
  3. Independent growth org with own VP/Head of Growth

### Elena Verna's Scaled Structure
- Head of Growth with multiple squads, one for every lever in the growth model: acquisition, activation, monetization, retention, major growth loops (viral, content, etc.)
- Each squad: Growth PM (metric owner), attached Data Analyst, attached Designer, Engineering lead

### Team Composition (Jeff Chang/Pinterest model)
- "Atomic growth team": PM + engineer-designer pairs
- All three roles (PM, engineer, designer) equally critical
- Growth team members usually wear multiple hats

### The "Pod" Model
- Growth teams commonly use matrixed/pod structures
- Engineers maintain connections to functional home bases while working cross-functionally
- Key roles: Growth PM, Growth Engineer, Growth Marketer, Growth Designer

### Key Structural Insight
- Growth engineering requires dedicated headcount; it doesn't work as a side project for product engineers
- Core Engineers should NOT be transitioned to Growth (wrong culture and mindset)

---

## 8. THE ALEXEY TEST: 11 STEPS TO BETTER GROWTH ENGINEERING

Source: Alexey Komissarouk (Growth Engineering Advisor, ex-Opendoor, ex-MasterClass)

1. **Proper A/B testing infrastructure**: Use real platforms (Eppo, Statsig, GrowthBook), not "userId mod 100"
2. **Experimentation-ready codebase**: Built-in helpers like getExperimentVariant(), <Experiment> component wrappers, dedicated experiment directories
3. **Fast deployment cycles**: Daily/continuous deployment for web. Native apps need workarounds (React Native Code Push, server-driven UI, webviews)
4. **Robust quality tooling**: PagerDuty for on-call, automated test suites, error boundaries preventing cascading failures from experiment crashes
5. **Comprehensive experiment results dashboards**: Standardized dashboards with critical segments (mobile vs. desktop, paid vs. organic, new vs. returning)
6. **Sound experimental hygiene**: No "peeking" at results prematurely. Holdouts, reruns, winner's curse controls. Unbiased analytics stakeholder grades impact claims.
7. **Engineer access to data infrastructure**: Engineers should explore Snowflake independently, not rely on analyst backlogs
8. **Engineer-generated experiment ideas**: Engineers should be "mini-PMs for their projects," owning experiments from conception through analysis
9. **Sustainable experiment velocity**: ~1 experiment every couple of weeks per engineer. Requires proper tooling and balanced project scoping.
10. **Appropriate company scale**: Need PMF first. B2B companies may lack traffic for statistical power.
11. **Metric ownership and autonomy**: Teams need metrics within their control, adjusted for seasonality.

---

## 9. EXPERIMENT VELOCITY BENCHMARKS

- **Typical target**: 4-6 tests per month per team
- **Quantitative**: 2-4 experiments launched monthly, 70% reaching statistical significance, 30% producing net revenue uplift
- **Google benchmark**: Top performers achieve 50+ experiments annually per product team, yielding 5-10% ROI on tested features
- **Extreme scale**:
  - Airbnb increased from 100 to 700 experiments per week over two years, runs 500+ tests concurrently
  - LinkedIn runs 35,000 concurrent experiments
  - Pinterest has 823 active experiments visible via API
- **Diminishing returns**: Impact per test peaks at 1-10 annual tests per engineer. Beyond 30 tests per engineer, expected impact drops by 87%.
- **Key insight**: "Scaling isn't about running more tests; it's about running smarter tests that drive real business value."

---

## 10. GROWTH ENGINEER CAREER PATH AND COMPENSATION

### Career Path
- Often a stepping stone to founder or PM roles
- Combines technical depth with business impact visibility
- Forces learning about the business in ways pure product engineering does not
- Non-linear entry paths common (marketing to engineering, economics to coding)
- Michael Taylor's journey: ~1,250 hours over 6-7 years of part-time study to reach professional competence

### Compensation (2025 data, US)
- **Average**: $101,752/year (ZipRecruiter), $120k-$155k disclosed in job posts
- **Higher end (Glassdoor)**: $254k (25th percentile) to $475k (75th percentile) at top companies
- **Senior trajectory**: Starting ~$120k to ~$272k at highest seniority
- **Top market (San Jose, CA)**: $123k average, 97% above US average
- Wide variance depending on company type, location, and how "growth engineer" is classified

### Job Titles by Level
- Growth Engineer / Software Engineer, Growth
- Senior Growth Engineer / Senior Software Engineer, Growth
- Staff Growth Engineer
- Growth Engineering Lead / Manager
- Head of Growth Engineering
- VP Growth

### What Companies Hire For (Interview Insights)
From Atlassian, SurveyMonkey, Gusto, HubSpot interviews:
- Synthesize incomplete information creatively under pressure
- Demonstrate resilience through setback narratives
- Think systematically about product mechanics and funnels
- Draw growth loops on a whiteboard from observation ("The Bullshit Test")
- Live brainstorm 5-7 experiment ideas
- Deep metrics knowledge ("keep asking about metrics until stopped")
- Propose a 6-month roadmap for the role
- Specific question: "How many times has the homepage been optimized?" (tests for identifying low-hanging fruit)

---

## 11. COMPANY-SPECIFIC EXAMPLES

### Uber (2024-2025)
- "#UberEverywhere" campaign: 10M X impressions, 1M new riders, AI-driven targeting, 25% booking increase
- By March 2025: 200+ curated AI skills in main hub, 300+ experimental tools in team repos, adding 20 new skills per week

### Airbnb
- "Mario" testing framework accessible via API
- Professional photography experiment for hosts (significant booking rate impact)
- Experiences feature allowing hosts to offer activities
- 500+ concurrent tests
- Actively suppresses company name mentions in profiles to prevent platform bypass

### Pinterest
- 823 active experiments visible via /v3/users/me/ endpoint
- Uses "gatekeeper_experiments" field

### Lyft
- Experiments served via /api/experiments/configurations (180KB JSON)
- 1,449 client variable keys, 162 variants, 44 holdout variants
- 61 categories of user profile variables

### Slack
- Three separate experiment routes: experiments.getEZFeatures, experiments.getByUser, experiments.getByVisitor

### Reddit
- 19 experiment "buckets" focused on content discovery

---

## 12. SOURCES INDEX

### Practitioner Articles
- PostHog: "What is a growth engineer?" - https://posthog.com/blog/what-is-a-growth-engineer
- PostHog Newsletter: "How to think like a growth engineer" - https://newsletter.posthog.com/p/how-to-think-like-a-growth-engineer
- Pragmatic Engineer: "What is Growth Engineering?" - https://newsletter.pragmaticengineer.com/p/what-is-growth-engineering
- Saxifrage Blog: "Intro to Growth Engineering" - https://www.saxifrage.xyz/post/growth-engineering
- Saxifrage Blog: "Becoming a Growth Engineer" - https://www.saxifrage.xyz/post/growth-engineer-career
- Jeff Chang: "How to build a high-impact growth team" - https://www.growthengblog.com/blog/2018/7/11/how-to-build-a-high-impact-growth-team-structure-and-hiring
- Alexey Komissarouk: "The Alexey Test: 11 Steps to Better Growth Engineering" - https://www.linkedin.com/pulse/alexey-test-11-steps-better-growth-engineering-alexey-komissarouk
- Andy Carvell/Phiture: "Growth Engineering vs Product Engineering" - https://phiture.com/mobilegrowthstack/growth-engineering-vs-product-engineering-f37fd37f095c/

### Company Engineering Blogs
- Atlassian: "What does a Product Growth engineer work on?" - https://www.atlassian.com/blog/atlassian-engineering/what-does-a-product-growth-engineer-work-on
- Productboard: "The Role of Growth Engineering at Productboard" - https://www.productboard.com/blog/the-role-of-growth-engineering-at-productboard-key-skills-responsibilities-methodologies/
- JonLuca's Blog: "Experiments, growth engineering, and the perils of not disguising your API routes" - https://blog.jonlu.ca/posts/experiments-and-growth-hacking

### Industry Analysis
- Elena Verna: "How to Build a Growth Engineering Team That WINS" - https://www.elenaverna.com/p/how-to-build-a-growth-engineering
- Elena Verna: "Growth Product Org Charts" - https://www.elenaverna.com/p/growth-product-org-charts-from-the
- Andrew Chen: "Growth Interview Questions from Atlassian, SurveyMonkey, Gusto, HubSpot" - https://andrewchen.com/growth-interview-questions-atlassian-surveymonkey-gusto-hubspot/
- Andrew Chen: "How to build a growth team" - https://andrewchen.com/how-to-build-a-growth-team/
- Reforge: "Growth Experiment Management System" - https://www.reforge.com/blog/growth-experiment-management-system
- Reforge: "How to Pick Your Ideal Growth Team Structure" - https://www.reforge.com/blog/growth-team-structure

### Tool/Platform Coverage
- Statsig: "Best Experimentation Tools for Growth Teams" - https://www.statsig.com/comparison/best-experimentation-tools-growth
- Statsig: "Features to 10x Experiment Velocity" - https://www.statsig.com/blog/features-to-10x-experiment-velocity
- Eppo: "Building the Future of Experimentation at Datadog" - https://www.geteppo.com/blog/building-the-future-of-experimentation-at-datadog
- Menlo Ventures: "Experimentation for the Modern Growth Stack (Eppo)" - https://menlovc.com/perspective/experimentation-for-the-modern-growth-stack-our-investment-in-eppo/
- GrowthBook: "Best A/B Testing Platforms of 2025" - https://blog.growthbook.io/the-best-a-b-testing-platforms-of-2025/

### Acquisitions/News
- TechCrunch: "OpenAI acquires Statsig" - https://techcrunch.com/2025/09/02/openai-acquires-product-testing-startup-statsig-and-shakes-up-its-leadership-team/
- TechCrunch: "Datadog acquires Eppo" - https://techcrunch.com/2025/05/05/datadog-acquires-eppo-a-feature-flagging-and-experimentation-platform/
- Unleash: "OpenAI + Statsig: What It Signals" - https://www.getunleash.io/blog/openai-statsig-feature-flags

### AI and Growth
- Everworker: "How LLMs Accelerate Growth Marketing" - https://everworker.ai/blog/llm_growth_marketing_experiments_personalization_analytics
- LangChain: "State of AI Agents" - https://www.langchain.com/state-of-agent-engineering
- Menlo Ventures: "2025: State of Generative AI in the Enterprise" - https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/

### Job Market
- Glassdoor: Growth Engineer salaries - https://www.glassdoor.com/Salaries/growth-engineer-salary-SRCH_KO0,15.htm
- Glassdoor: Growth Engineer interview questions - https://www.glassdoor.com/Interview/growth-engineer-interview-questions-SRCH_KO0,15.htm
- ZipRecruiter: Growth Engineer jobs and salaries - https://www.ziprecruiter.com/Jobs/Growth-Engineer
- Teal: Growth Engineer career path 2025 - https://www.tealhq.com/career-paths/growth-engineer
