# MathEasy

## Current State
A math learning app with 6 topics (Algebra, Geometry, Calculus, Statistics, Trigonometry, Functions), lessons with examples, practice questions, quiz mode, and progress tracking with Internet Identity login.

## Requested Changes (Diff)

### Add
- Nothing new — full rebuild of existing functionality

### Modify
- Rebuild frontend and backend from scratch with improved content and UI
- More practice questions per topic (at least 5 per topic)
- More lessons per topic

### Remove
- Nothing

## Implementation Plan
1. Keep authorization component
2. Regenerate Motoko backend with richer seed data (more questions and lessons per topic)
3. Rebuild React frontend with clean, modern UI
   - Home page with topic overview
   - Topics listing page
   - Topic detail with lessons and examples
   - Practice mode with instant feedback
   - Quiz mode (10 timed questions)
   - Progress page (requires login)
   - Navbar + Footer
