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

  test("markdown", function(done) {
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
            "## Evaluates

            ### /home/piranna/github/projectlint/cli

            #### Success: dumb
            "
          `)
        );
      }
    };

    cli(rules, config, "markdown", { stdout });
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

  test("tasktree", function() {
    const rules = {
      dumb: {
        evaluate() {}
      }
    };

    // const config = ["dumb"];
    const config = {
      dumb: "warning"
    };

    const buffer = [];
    const stdout = {
      write(data) {
        buffer.push(data);
      }
    };

    return cli(rules, config, "tasktree", { stdout }).then(function() {
      expect(buffer).toMatchInlineSnapshot(`
        Array [
          "[?25l",
          "  [38;2;66;133;244m❯[39m /home/piranna/github/projectlint/cli
        [38;2;131;133;132m  [38;2;46;46;46m›[39m[38;2;131;133;132m [38;2;0;200;81m✔[39m[38;2;131;133;132m dumb[39m
        ",
          "[?25h",
          "[?25l",
          "[?25h",
        ]
      `);
    });
  });
});
