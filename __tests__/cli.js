const { Readable } = require("stream");

const concat = require("concat-stream");

const cli = require("../lib/cli");

test("no arguments", function() {
  function func() {
    cli();
  }

  expect(func).toThrowErrorMatchingInlineSnapshot(
    `"\`rules\` argument must be set"`
  );
});

test("basic", function(done) {
  const rules = {
    dumb: {
      evaluate() {}
    }
  };

  // const config = ["dumb"];
  const config = {
    dumb: "warning"
  };

  const result = cli(rules, config);

  expect(result).toBeInstanceOf(Readable);

  result.pipe(
    concat({ encoding: "string" }, function(result) {
      done(
        expect(result).toMatchInlineSnapshot(`
          "[
            {
              \\"name\\": \\"dumb\\",
              \\"projectRoot\\": \\"/home/piranna/github/projectlint/cli\\"
            }
          ]"
        `)
      );
    })
  );
});
