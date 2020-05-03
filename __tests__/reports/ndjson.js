const cli = require("../../lib/cli");

test("success", function(done) {
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
