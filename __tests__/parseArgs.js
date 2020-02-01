const parseArgs = require("../lib/parseArgs");


const CLI_PATH = process.cwd();

test("no arguments", function() {
  const result = parseArgs({ argv: [] });

  expect(result).toMatchInlineSnapshot(`
    Object {
      "configs": Array [],
      "fix": false,
      "projectRoot": Array [],
      "rules": Object {},
      "use_projectlintrc": true,
    }
  `);
});

test("plugin", function() {
  const result = parseArgs({
    argv: ["--plugin", "./__fixtures__/dumb plugin.js"]
  });

  expect(result).toMatchInlineSnapshot(`
    Object {
      "configs": Array [],
      "fix": false,
      "projectRoot": Array [],
      "rules": Object {
        "${CLI_PATH}/__fixtures__/dumb plugin.js": Object {
          "dumb rule": Object {
            "evaluate": [Function],
          },
        },
      },
      "use_projectlintrc": true,
    }
  `);
});

test("rule", function() {
  const result = parseArgs({
    argv: ["--plugin", "./__fixtures__/dumb plugin 2.js", "--rule", "dumb rule"]
  });

  expect(result).toMatchInlineSnapshot(`
    Object {
      "configs": Array [
        "dumb rule",
      ],
      "fix": false,
      "projectRoot": Array [],
      "rules": Object {
        "${CLI_PATH}/__fixtures__/dumb plugin 2.js": Object {
          "dumb rule": Object {
            "evaluate": [Function],
          },
        },
      },
      "use_projectlintrc": true,
    }
  `);
});

test("config", function() {
  const result = parseArgs({
    argv: [
      "--plugin",
      "./__fixtures__/dumb plugin 2.js",
      "--config",
      "./__fixtures__/dumb 2.json:default"
    ]
  });

  expect(result).toMatchInlineSnapshot(`
    Object {
      "configs": Array [
        Array [
          "dumb rule",
          "warning",
        ],
      ],
      "fix": false,
      "projectRoot": Array [],
      "rules": Object {
        "${CLI_PATH}/__fixtures__/dumb plugin 2.js": Object {
          "dumb rule": Object {
            "evaluate": [Function],
          },
        },
      },
      "use_projectlintrc": true,
    }
  `);
});

describe("resolvePackage", function() {
  const paths = [`${CLI_PATH}/__fixtures__`];

  test("prefixed", function() {
    const result = parseArgs({ argv: ["--plugin", "dumb"], paths });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "configs": Array [],
        "fix": false,
        "projectRoot": Array [],
        "rules": Object {
          "${CLI_PATH}/__fixtures__/projectlint-plugin-dumb.js": Object {
            "prefixed": Object {
              "evaluate": [Function],
            },
          },
        },
        "use_projectlintrc": true,
      }
    `);
  });

  test("scoped", function() {
    const result = parseArgs({ argv: ["--plugin", "dumb 2"], paths });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "configs": Array [],
        "fix": false,
        "projectRoot": Array [],
        "rules": Object {
          "${CLI_PATH}/__fixtures__/@projectlint/plugin-dumb 2.js": Object {
            "scoped": Object {
              "evaluate": [Function],
            },
          },
        },
        "use_projectlintrc": true,
      }
    `);
  });
});
