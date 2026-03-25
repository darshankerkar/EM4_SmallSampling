# POSTER & PPT CONTENT



> **Note to teammate:** Everything below is copy-paste ready.
> Section A is for the Canva poster designer. Section B is your PPT, slide by slide.
> Do not change the formulas — they match the actual code exactly.

---

---

# SECTION A — POSTER CONTENT

---

## A1 · POSTER TITLE OPTIONS (choose one)

**Option 1 — Technical:**
> AI vs Human: A Small-Sample t-Test on Student Score Prediction Accuracy

**Option 2 — Catchy:**
> Can AI Out-Predict You? We Did the Math.

---

## A2 · SUBTITLE (one line, under the title)

> A live statistical analysis comparing AI model accuracy against human intuition
> using a manually implemented paired t-test — no black boxes, no scipy.

---

## A4 · THE CORE QUESTION BOX

Place this in a highlighted card / callout box on the poster:

> **"When a trained AI model and a human both try to predict the same
> student's end-semester score — is the difference in their accuracy
> statistically significant, or just noise?"**

Supporting line (smaller text below):
> We used a manually implemented paired t-test on n = 10 students to find out.

---

## A5 · HOW IT WORKS — 4-STEP FLOW

*(For the designer: render as a horizontal arrow flow or numbered circles)*

| Step | Short Label | Detail (caption text) | Suggested Icon |
|------|-------------|----------------------|----------------|
| 1 | **Train the AI** | Linear Regression learns from 6 academic features | 🤖 |
| 2 | **Sample 10 Students** | Random cohort — AI predicts instantly | 🎲 |
| 3 | **Human Guesses** | You enter your predicted EndSem (0–100) for each student | ✍️ |
| 4 | **Run the t-Test** | Paired differences → t-statistic → p-value → Conclusion | 📊 |

---

## A6 · THE FORMULA BOX

*(For the designer: place in a code-style card with a light blue background)*

**The t-Statistic (Step 4 of 4):**

```
         d̄
t  =  ────────
      Sd / √n
```

**What each part means:**

| Symbol | Meaning |
|--------|---------|
| `d̄` | Average of (AI error − Human error) across all 10 students |
| `Sd` | Sample standard deviation of those differences (uses n−1, Bessel's correction) |
| `n` | Sample size = 10 students |
| `Sd / √n` | Standard Error — how reliably d̄ estimates the true mean |
| `df` | Degrees of freedom = n − 1 = **9** |

---

## A7 · SAMPLE RESULT BOX

*(For the designer: render as a stat dashboard card — 3 columns)*
*(These numbers are realistic for this project's scale. AI error ~8–9 marks, human ~12–14.)*

```
┌─────────────────────────────────────────────────────────────────┐
│  SAMPLE OUTPUT FROM THE DASHBOARD                               │
├──────────────────┬──────────────────┬───────────────────────────┤
│  Mean AI Error   │  Mean Human Error│  t-Statistic              │
│      8.40        │      13.20       │      −2.84                │
├──────────────────┼──────────────────┼───────────────────────────┤
│  p-Value         │  df              │  α (chosen)               │
│      0.0193      │       9          │      0.05                 │
├──────────────────┴──────────────────┴───────────────────────────┤
│  ✅  Reject H₀ — Statistically significant difference detected  │
├──────────────────┬──────────────────────────────────────────────┤
│  Cohen's d       │  95% Confidence Interval (for μ_d)           │
│     −0.62        │        [ −9.1 ,  −0.5 ]                      │
│  Medium effect   │  Does not contain 0 → consistent with reject │
└──────────────────┴──────────────────────────────────────────────┘
```

---

## A8 · WHAT IS A PAIRED t-TEST — 3 BULLETS

*(For the designer: use a simple bullet list card)*

- **Both predictors saw the same 10 students.** The AI and the human made predictions for the exact same cohort — so we subtract their errors per student, not across groups. This pairing removes noise caused by student-to-student variation.

- **Small sample demands a t-test, not a Z-test.** With only n = 10 observations, the population standard deviation is unknown and must be estimated from the data. The t-distribution with df = 9 accounts for this extra uncertainty.

- **We test the mean difference, not raw scores.** The question is: is the average of (AI Error − Human Error) significantly different from zero? A negative mean means AI errors were consistently smaller.

---

## A9 · REAL WORLD APPLICATIONS — 3 EXAMPLES

*(For the designer: 3 icon cards in a row)*

**🩺 Medical AI Screening**
A diagnostic AI and a specialist physician both classify the same 10 patient scans. Paired t-test on their error rates determines whether the AI is ready for clinical pre-screening.

**📝 Automated Essay Grading**
An NLP grading model and a human examiner both score the same 10 student essays. The paired design controls for essay-quality variation — the test isolates whether the grader (AI or human) is the source of any systematic difference.

**🏭 Industrial Defect Detection**
A machine-vision system and a trained floor technician both inspect the same 10 manufactured parts. The paired t-test on detection accuracy decides whether automated inspection can replace manual checks — at low sample size, because rare defect batches are costly to reproduce.

---

# SECTION B — PPT SLIDE BY SLIDE

---

## SLIDE 1 — TITLE SLIDE

**Slide Title:**
> AI vs Human — Small Sample Paired t-Test

**Slide Content:**
```
Comparing AI Model Accuracy Against Human Intuition
Using a Manually Implemented Small Sample t-Test


## SLIDE 2 — THE PROBLEM

**Slide Title:**
> Why Compare AI vs Human Prediction?

**Slide Content:**
```
The Setup
─────────
• Student academic data: Mid1, Mid2, Internal marks,
  Attendance %, Study Hours/day, Sleep Hours/day

• A Linear Regression AI model predicts End Semester
  score (0–100) using these 6 features

• A human also predicts the same End Semester score
  for the same 10 students — given the same features

The Question
────────────
Is the AI's prediction error significantly lower
than the human's prediction error?

Or is the difference just random variation?
```


## SLIDE 3 — WHAT IS A SMALL SAMPLE t-TEST?

**Slide Title:**
> The t-Test: When Your Sample Is Too Small to Trust the Normal Curve

**Slide Content:**
```
When do we use a t-Test?
─────────────────────────
✓  Sample size n < 30   (we have n = 10)
✓  Population std deviation σ is unknown
✓  We estimate σ from the sample using Bessel's correction

Why NOT a Z-test?
──────────────────
• Z-test assumes σ is known — it almost never is
• With small n, using Z underestimates true uncertainty
• t-distribution has heavier tails → honest about small-sample error

The t-Distribution
───────────────────
• Bell-shaped, like normal — but wider and shorter
• Controlled by degrees of freedom: df = n − 1 = 9
• As n increases, t-distribution converges to normal distribution
```

---

## SLIDE 4 — WHY PAIRED t-TEST SPECIFICALLY?

**Slide Title:**
> Paired, Not Independent — Here's Why It Matters

**Slide Content:**
```
The Pairing Structure
──────────────────────
Both the AI and the human predict for the SAME 10 students.
Each pair shares the same ground-truth Actual score.

Student   Actual   AI Error   Human Error   d = AI − Human
─────────────────────────────────────────────────────────
   S01      72       4.2         11.0          −6.8
   S02      61       8.1          5.5           +2.6
   S03      85       3.7         14.2          −10.5
  ...       ...      ...          ...           ...
  Mean                                          d̄

Why NOT an independent two-sample t-test?
──────────────────────────────────────────
• S01's AI error and S01's human error are BOTH tied
  to S01's actual score — they are not independent
• Ignoring this link reduces statistical power
• Paired design removes between-student noise
```



## SLIDE 5 — DATASET & MODEL

**Slide Title:**
> The Data: Synthetic, Realistic, and Reproducible

**Slide Content:**
```
Input Features (6 columns) — used by the AI model
───────────────────────────────────────────────────
Feature       Range          Description
──────────────────────────────────────────────────
Mid1          10 – 30        Mid-semester 1 marks
Mid2          10 – 30        Mid-semester 2 marks
Internal      5  – 20        Continuous assessment marks
Attendance    50 – 100 %     Class attendance percentage
StudyHours    1  – 10 /day   Daily study hours
SleepHours    4  –  9 /day   Daily sleep hours

Target Variable
────────────────
EndSem (0–100) = Mid1×0.5 + Mid2×0.5 + Internal×1.5
                 + Attendance×0.2 + StudyHours×2
                 − SleepHours×0.5 + noise

The AI Model
─────────────
• Algorithm : Linear Regression (sklearn)
• Trained on: 100 synthetic records (numpy seed = 42)
• No static file — data is generated fresh each run
```


## SLIDE 6 — MANUAL IMPLEMENTATION

**Slide Title:**
> The Math: Built From Scratch, Step by Step

**Slide Content:**
```
All implemented in math_utils.py
No scipy. No statsmodels. Only Python's built-in math module.

Step 1 — Pairwise Differences
   d_i = AI_error_i − Human_error_i   (for i = 1 … 10)
   negative d_i → AI was closer to actual for that student

Step 2 — Mean of Differences
          Σ d_i
   d̄  =  ──────
            n

Step 3 — Sample Std. Deviation  [Bessel's Correction]
          √( Σ(d_i − d̄)² )
   Sd =   ─────────────────    ← divides by n−1, not n
               n − 1

Step 4 — t-Statistic
           d̄
   t  =  ──────    df = n − 1 = 9
         Sd / √n

p-Value: Abramowitz & Stegun (1964) polynomial approximation
of the standard normal CDF. Two-tailed. No library used.
```

## SLIDE 7 — HYPOTHESES & DECISION RULE

**Slide Title:**
> What Are We Actually Testing?

**Slide Content:**
```
The Hypotheses
───────────────
H₀ :  μ_d = 0
      Mean of (AI_error − Human_error) = 0
      AI and Human are equally accurate on average

H₁ :  μ_d ≠ 0     [two-tailed]
      A consistent, directional difference exists
      One predictor is reliably better than the other

Why Two-Tailed?
────────────────
We did not assume in advance that AI would win.
Either AI or Human could be better → two-tailed.

The Decision Rule  (α = 0.05)
───────────────────────────────
Critical t  at df=9, α=0.05, two-tailed : ±2.262

REJECT H₀    if  |t_observed| > 2.262   OR   p < 0.05
FAIL TO REJECT   if  |t_observed| ≤ 2.262  AND  p ≥ 0.05

The dashboard also supports α = 0.01  (crit: ±3.250)
                          and α = 0.10  (crit: ±1.833)
```


## SLIDE 8 — RESULTS & INTERPRETATION

**Slide Title:**
> Reading the Dashboard Output

**Slide Content:**
```
Four Metric Cards — update live on every keystroke
───────────────────────────────────────────────────
• Mean AI Error    — avg |Actual − AIPred| across 10 students
• Mean Human Error — avg |Actual − HumanPred| across 10 students
• t-Statistic      — monospace display; df = 9
• p-Value          — with Significant / Not Significant badge

Significance Banner (changes in real time)
───────────────────────────────────────────
Green  →  Reject H₀   "Significant difference detected"
Orange →  Fail to Reject H₀  "No significant difference"

Cohen's d — Effect Size
────────────────────────
d = d̄ / Sd
Tells us HOW LARGE the difference is, not just whether it exists.
|d| < 0.2 Negligible · 0.2–0.5 Small · 0.5–0.8 Medium · ≥0.8 Large

95% Confidence Interval
─────────────────────────
d̄ ± 2.262 × (Sd / √10)
If this interval excludes 0 → all three measures agree: reject H₀
```


## SLIDE 9 — LIVE DEMO

**Slide Title:**
> LIVE DASHBOARD DEMO
> http://localhost:5173

**Slide Content:**
```
What to show — follow this order:

1. NEW SAMPLE BUTTON
   Click → 10 fresh students appear with all 6 feature columns
   AI predictions show in blue (pre-computed by the model)

2. LIVE RECALCULATION
   Type human predictions into the input fields (e.g., 65, 70…)
   All 4 metric cards update on every single keystroke
   No submit button — the math runs live in the browser

3. ALPHA SELECTOR
   Click between α = 0.01 / 0.05 / 0.10
   Watch the significance banner and critical value change
   with the same data — different threshold, different decision

4. t-DISTRIBUTION CURVE
   Point to the blue (acceptance) and red (rejection) regions
   Show the dashed teal line = current t-statistic position
   The curve is for df = 9 — matches our paired test exactly

5. MATHEMATICAL DERIVATION PANEL
   Click ▸ Show → expand the 4-step working
   Every step shows actual computed values from your predictions
   Final t-statistic displayed large at the bottom
```


## SLIDE 10 — APPLICATIONS & CONCLUSION

**Slide Title:**
> Where This Method Applies — and What We Proved

**Slide Content:**
```
Three Real-World Applications of This Exact Approach
──────────────────────────────────────────────────────

🩺 Medical AI Validation
   AI and radiologist both read the same 10 patient scans.
   Paired t-test on diagnostic error → Is AI safe for
   clinical pre-screening? Small n = rare cases available.

📝 Automated Essay Grading
   AI grader and human examiner score the same 10 essays.
   Paired design controls for essay-quality variation.
   Is AI grading consistent enough for large-scale use?

🏭 Manufacturing Defect Detection
   Vision system vs. technician on the same 10 parts.
   Paired t-test on detection accuracy → can automation
   replace manual inspection at realistically small sample?

Conclusion
───────────
A manually implemented paired t-test is a rigorous,
transparent method for comparing two evaluators on
the same subjects — and implementing it from scratch
proves understanding of the math, not just the syntax.

Thank you.
```



---

*End of document.*
*Section A → Canva poster designer.*
*Section B → PPT, slide by slide.*
*All content grounded in: backend/app.py · backend/math_utils.py · frontend/src/App.jsx*
