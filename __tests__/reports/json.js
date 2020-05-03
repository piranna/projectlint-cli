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
    },
  };

  cli(rules, config, "json", { stdout });
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
          "{
            \\"evaluates\\": {
              \\"/home/piranna/github/projectlint/cli\\": {
                \\"dumb\\": {
                  \\"failure\\": {
                    \\"name\\": \\"Failure\\"
                  },
                  \\"level\\": 1
                }
              }
            }
          }"
        `)
      );
    },
  };

  cli(rules, config, "json", { stdout });
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
          "{
            \\"evaluates\\": {
              \\"/home/piranna/github/projectlint/cli\\": {
                \\"dumb\\": {
                  \\"failure\\": {
                    \\"name\\": \\"Failure\\"
                  },
                  \\"level\\": 2
                }
              }
            }
          }"
        `)
      );
    },
  };

  cli(rules, config, "json", { stdout });
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
          "{
            \\"evaluates\\": {
              \\"/home/piranna/github/projectlint/cli\\": {
                \\"dumb\\": {
                  \\"error\\": {},
                  \\"level\\": 1
                }
              }
            }
          }"
        `)
      );
    },
  };

  cli(rules, config, "json", { stdout });
});
