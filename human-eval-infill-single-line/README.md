# Human Eval Single Line Dataset

A dataset of HumanEval infill evaluation cases curated from https://github.com/openai/human-eval-infilling/tree/master

Primary modifications:

- Transformed from JSON strings into actual code files, for each modification and reading
- Removed multi-line cases, as often that spanned far beyond what autocomplete would do. We could consider re-adding these if we support benchmarking cases across multiple completion requests (e.g. case X passed, after 4 completions)
- Removed cases that were not realistic for autocomplete. (e.g. "█of list{", we wouldn't suggest a completion here as there are characters after the current cursor position, and doing so would shift text around for the user.) We could consider supporting this if we support a method of manually triggering a completion that would override any restrictions.
  s
