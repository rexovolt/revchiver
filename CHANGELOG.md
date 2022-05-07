# v0.4.0 (2022-05-06)

- BREAKING: Update to Revolt.JS v6.0.0.
- Fix inability to fetch more than 100 messages.

# v0.3.1 (2022-05-06)

- Hotfix for v0.3.0.

# v0.3.0 (2022-05-06)

- BREAKING: The `client` param of `archiveChannel()` has been removed - it was unused.
- `archiveChannel()` now takes an optional `ignoreSuppliedMessages` param (a boolean, defaulting to `true`) - this determines whether to ignore the first message passed to the function (the second message, `botMsg`, will always be ignored.)

# v0.2.0 (2022-05-01)

- BREAKING: `archive()` has been renamed to `archiveChannel()`, and now returns an object instead of a string.

# v0.1.4 (2022-04-17)

- Fix types (#1) - thanks @sportshead!

# v0.1.3 (2022-04-17)

- Attempt to fix types.

# v0.1.2 (2022-04-17)

- Attempt to fix types.

# v0.1.1 (2022-04-17)

- Add types.

# v0.1.0 (2022-04-15)

Initial release.
