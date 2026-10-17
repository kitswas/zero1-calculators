# Repo Rules

1. Never edit this file directly.
2. Every line of code is a liability.
3. Do not commit secrets or sensitive information.
4. If edits in one file affect another, update both files to maintain consistency.
5. Deleting/minimizing is better than adding.
6. Do not implement workarounds or use hacks. Keep the implementation clean and maintainable. If something is not working, fix the root cause instead of patching it.
7. Git commits should be atomic and self-contained. Commit message description should be concise and explain why (what's not obvious from the diff). Skip descriptions for small changes.
8. Make no assumptions. Always ask for clarification if needed.
9. Prioritize simplicity and clarity in code and design.
10. All Python one-shot/automation scripts (not module files) must declare their dependencies (versioned) via [inline script metadata](https://packaging.python.org/en/latest/specifications/inline-script-metadata/#inline-script-metadata).
