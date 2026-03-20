# MathEasy

## Current State
New project. No existing features.

## Requested Changes (Diff)

### Add
- Math topics browser covering: Algebra, Geometry, Calculus, Statistics, Trigonometry, Functions
- Each topic contains lessons with step-by-step explanations and worked examples
- Practice questions per topic with multiple-choice options and detailed answer explanations
- Interactive quiz mode with timed sessions, scoring, and results
- Progress tracking: topics started/completed, questions answered correctly
- Search topics functionality
- User authentication so progress is saved per user

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: store topics, lessons, questions (with options + answer + explanation). Track user progress (questions answered, scores).
2. Backend: expose queries for topics list, topic detail (lessons + questions), random practice questions, quiz questions. Mutations for recording answers/progress.
3. Frontend: Landing/hero page, Topics grid, Topic detail page (lessons + examples), Practice mode (one question at a time with answer reveal), Quiz mode (timed, 10 questions, scored), Progress dashboard.
4. Auth via authorization component for saving progress per user.
