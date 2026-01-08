# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - heading "useSQL Hook Tests" [level=1] [ref=e2]
  - generic [ref=e4]:
    - paragraph [ref=e5]: "Phase: 9"
    - paragraph [ref=e6]: "Count: [{\"count\":3}]"
  - generic [ref=e7]:
    - generic [ref=e8]: Setting up test data...
    - generic [ref=e9]: Setup complete
    - generic [ref=e10]: "PASS: Simple query returns data"
    - generic [ref=e11]: "PASS: COUNT shows 3 users"
    - generic [ref=e12]: "PASS: Param query finds 1 Alice"
    - generic [ref=e13]: "PASS: Param query finds correct user"
    - generic [ref=e14]: "PASS: Param query re-runs when params change"
    - generic [ref=e15]: "PASS: GROUP BY returns 3 categories"
    - generic [ref=e16]: "PASS: GROUP BY counts correctly"
    - generic [ref=e17]: "PASS: SUM aggregate works"
    - generic [ref=e18]: "PASS: Subquery returns 3 categories"
    - generic [ref=e19]: "PASS: Subquery MAX works"
    - generic [ref=e20]: "PASS: HAVING filters to 2 categories"
    - generic [ref=e21]: "PASS: LIMIT returns 1 row"
    - generic [ref=e22]: "PASS: ORDER BY DESC returns oldest user"
    - generic [ref=e23]: "PASS: Correct age returned"
    - generic [ref=e24]: "PASS: Complex WHERE returns correct rows"
    - generic [ref=e25]: "PASS: Results ordered by price"
    - generic [ref=e26]: Testing reactivity - inserting new item...
```