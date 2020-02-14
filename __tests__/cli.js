const cli = require("../lib/cli");

test("no arguments", function() {
  function func() {
    cli();
  }

  expect(func).toThrowErrorMatchingInlineSnapshot(
    `"The \\"path\\" argument must be of type string. Received undefined"`
  );
});

describe("reports", function() {
  test("json", function(done) {
    const rules = {
      dumb: {
        evaluate() {}
      }
    };

    // const config = ["dumb"];
    const config = {
      dumb: "warning"
    };

    const stdout = {
      write(data) {
        done(
          expect(data).toMatchInlineSnapshot(`
            "{
              \\"evaluates\\": {
                \\"/home/piranna/github/projectlint/cli\\": {
                  \\"dumb\\": {
                    \\"level\\": 0
                  }
                }
              }
            }"
          `)
        );
      }
    };

    cli(rules, config, "json", { stdout });
  });

  test("ndjson", function(done) {
    const rules = {
      dumb: {
        evaluate() {}
      }
    };

    // const config = ["dumb"];
    const config = {
      dumb: "warning"
    };

    const stdout = {
      write(data) {
        done(
          expect(data).toMatchInlineSnapshot(`
"{\\"name\\":\\"dumb\\",\\"projectRoot\\":\\"/home/piranna/github/projectlint/cli\\",\\"level\\":0}
"
`)
        );
      }
    };

    cli(rules, config, "ndjson", { stdout });
  });
});
