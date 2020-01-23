const { Readable } = require("stream");

const concat = require("concat-stream");

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

    const result = cli(rules, config, "json");

    expect(result).toBeInstanceOf(Readable);

    result.pipe(
      concat({ encoding: "string" }, function(result) {
        done(
          expect(result).toMatchInlineSnapshot(`
            "{
              \\"/home/piranna/github/projectlint/cli\\": {
                \\"dumb\\": {}
              }
            }"
          `)
        );
      })
    );
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

    const result = cli(rules, config, "ndjson");

    expect(result).toBeInstanceOf(Readable);

    result.pipe(
      concat({ encoding: "string" }, function(result) {
        done(
          expect(result).toMatchInlineSnapshot(`
            "{\\"name\\":\\"dumb\\",\\"projectRoot\\":\\"/home/piranna/github/projectlint/cli\\"}
            "
          `)
        );
      })
    );
  });
});
