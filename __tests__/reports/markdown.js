const { Failure } = require("@projectlint/projectlint");

const cli = require("../../lib/cli");

test("success", function (done) {
  const rules = {
    dumb: {
      evaluate() {},
    },
  };

  // const config = ["dumb"];
  const config = {
    dumb: "warning",
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
    },
  };

  cli(rules, config, "markdown", { stdout });
});

test("failure", function (done) {
  const rules = {
    dumb: {
      evaluate() {
        throw new Failure();
      },
    },
  };

  const config = {
    dumb: "warning",
  };

  const stdout = {
    write(data) {
      done(
        expect(data).toMatchInlineSnapshot(`
          "## Evaluates

          ### /home/piranna/github/projectlint/cli

          #### Warning: dumb
          "
        `)
      );
    },
  };

  cli(rules, config, "markdown", { stdout });
});

test("failure as error", function (done) {
  const rules = {
    dumb: {
      evaluate() {
        throw new Failure();
      },
    },
  };

  const config = {
    dumb: "error",
  };

  const stdout = {
    write(data) {
      done(
        expect(data).toMatchInlineSnapshot(`
          "## Evaluates

          ### /home/piranna/github/projectlint/cli

          #### Error: dumb
          "
        `)
      );
    },
  };

  cli(rules, config, "markdown", { stdout });
});

test("error at warning level", function (done) {
  const rules = {
    dumb: {
      evaluate() {
        throw new Error();
      },
    },
  };

  const config = {
    dumb: "warning",
  };

  const stdout = {
    write(data) {
      done(
        expect(data).toMatchInlineSnapshot(`
          "## Evaluates

          ### /home/piranna/github/projectlint/cli

          #### Warning: dumb
          "
        `)
      );
    },
  };

  cli(rules, config, "markdown", { stdout });
});
