# Contributing to RDS DaaS

This project welcomes contributions and suggestions.

- [Issues and Bugs](#finding-issues)
- [Feature Requests](#requesting-features)
- [Submission Guidelines](#submission-guidelines)

## Finding Issues

If you find a bug in the source code or a mistake in the documentation, you can help us by
[submitting an issue](#submitting-an-issue) to the GitHub Repository. Even better, you can
[submit a Pull Request](#submitting-a-pull-request) with a fix.

## Requesting Features

You can *request* a new feature by [submitting an issue](#submitting-an-issue) to the GitHub
Repository. If you would like to *implement* a new feature, please submit an issue with
a proposal for your work first, to be sure that we can use it.

**Small Features** can be crafted and directly [submitted as a Pull Request](#submitting-a-pull-request).

## Submission Guidelines

### Submitting an Issue

Before you submit an issue, search the archive, maybe your question was already answered.

If your issue appears to be a bug and hasn't been reported, open a new issue.
Help us to maximize the effort we can spend fixing issues and add new
features, by not reporting duplicate issues.  Providing the following information will increase the
chances of your issue being dealt with quickly:

- **Overview of the Issue** - if an error is being thrown a non-minified stack trace helps
- **Version** - what version is affected (e.g. 0.1.2)
- **Motivation for or Use Case** - explain what are you trying to do and why the current behavior is a bug for you
- **Browsers and Operating System** - is this a problem with all browsers?
- **Reproduce the Error** - provide a live example or an unambiguous set of steps
- **Related Issues** - has a similar issue been reported before?
- **Suggest a Fix** - if you can't fix the bug yourself, perhaps you can point to what might be
  causing the problem (line of code or commit)

You can file new issues by providing the above information at the [corresponding repository's issues link](https://github.com/isaiahwilliams/RDS-DaaS/issues/new).

### Submitting a Pull Request

Before you submit your Pull Request (PR) consider the following guidelines:

- [Search the repository](https://github.com/Microsoft/RDS-DaaS/pulls) for an open or closed PR
  that relates to your submission. You don't want to duplicate effort.

- Make your changes in a new git fork:

- Commit your changes using a descriptive commit message
- Push your fork to GitHub:
- In GitHub, create a pull request
- If we suggest changes then:
  - Make the required updates.
  - Rebase your fork and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase master -i
    git push -f
    ```

That is it! Thank you for your contribution!