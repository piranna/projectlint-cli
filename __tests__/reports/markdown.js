const cli = require("../../lib/cli");

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
