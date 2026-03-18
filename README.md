## *The coverage*

In this test assignment I was focused on smoke tests of the `https://funda.nl` site. During this task
- I made some assumptions regarding which critical paths are the most important based on my subjective opinion and common sense
- I did not test any features that involve changing the server state
- I've noticed that the layout of the search filters depends on the screen size, that's why I've included different configurations of the screen
- I did not include tests for the mobile layout since it would require additional research
- I wrote these tests as smoke tests to verify the basic functionality

### *Critical paths scenario*

I assumed that the most critical path for Funda is
- to find a place to buy or rent in a specific area, filter by price and/or property type
- to call an agency or to sign up for a viewing

I think that posting a property is also important but it is not possible to test on a production site since the process is complicated and involves changes in the state of the server.

### *Test suites*

- `tests/legal.spec.ts` - GDPR-related test
- `tests/navigation.spec.ts` - tests related to navigation between pages
- `tests/search.list.spec.ts` - applying search logic, validating results and pagination
- `tests/filter.list.spec.ts` - test the logic of the most critical filters
- `tests/propertycard.spec.ts` - testing that the property card and its most important features work correctly

### Tools used

For this task, I chose Playwright with TypeScript because it is a convenient and popular framework for UI testing.

### *Technical limitations*

1. Even with the use of a special header GDPR test fails in headless mode due to bot detection, so it can be only run in `--headed` mode.

2. Search results page uses a very dynamic DOM and it requires tests to wait until all operations are done. Without access to the codebase, I couldn't identify event or element state I could use to ensure that page is fully loaded before running tests. So, I implemented the best effort approach:
- Blocked some ads, analytics requests to make page faster
- Added a wait for `networkidle` after opening the page 

While this approach works well most of the time, sometimes `networkidle` can occasionally be flaky, most likely during peak traffic times. 

## *Run tests*

1. set up User-agent
```sh
cp .env.example .env
vim .env
```

2. Install project dependencies (from the project root):
`npm install`

3. Install npm package
`npm install @playwright/test `

4. Install Playwright browsers and system dependencies:
`npx playwright install --with-deps`

5. Run all tests:
`npx playwright test`

6. Run all tests in headed mode:
`npx playwright test --headed`

Tests use pre-saved state with accepted GDPR-cookies and entered captcha. In case tests fail because of bot detection, run the command below, accept cookies and enter the captcha:

`npx playwright codegen https://funda.nl --save-storage=data/state.json`

