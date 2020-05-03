const { Failure } = require("@projectlint/projectlint");

const cli = require("../../lib/cli");

let buffer;
const stdout = {
  write(data) {
    buffer.push(data);
  },
};

test("success", function () {
  const rules = {
    dumb: {
      evaluate() {},
    },
  };

  // const config = ["dumb"];
  const config = {
    dumb: "warning",
  };

  buffer = [];

  return cli(rules, config, "tasktree", { stdout }).then(function () {
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

test("failure", function () {
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

  buffer = [];

  return cli(rules, config, "tasktree", { stdout }).then(function () {
    expect(buffer).toMatchInlineSnapshot(`
      Array [
        "[?25l",
        "  [38;2;66;133;244m❯[39m /home/piranna/github/projectlint/cli
      [38;2;131;133;132m  [38;2;46;46;46m›[39m[38;2;131;133;132m [38;2;255;187;51m⚠[39m[38;2;131;133;132m [38;2;255;187;51mdumb[39m[38;2;131;133;132m[39m
      [38;2;131;133;132m    [38;2;46;46;46m─[39m[38;2;131;133;132m [38;2;255;187;51m⚠[39m[38;2;131;133;132m Failure[39m
      ",
        "[?25h",
        "[?25l",
        "[?25h",
      ]
    `);
  });
});

test("failure as error", function () {
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

  buffer = [];

  return cli(rules, config, "tasktree", { stdout }).then(function () {
    expect(buffer).toMatchInlineSnapshot(`
      Array [
        "[?25l",
        "  [38;2;66;133;244m❯[39m /home/piranna/github/projectlint/cli
      [38;2;131;133;132m  [38;2;46;46;46m›[39m[38;2;131;133;132m [38;2;255;68;68m✖[39m[38;2;131;133;132m [38;2;255;68;68mdumb[39m[38;2;131;133;132m [38;2;131;133;132m[fail][39m[38;2;131;133;132m[39m
      [38;2;131;133;132m    [38;2;255;68;68m[38;2;46;46;46m─[39m[38;2;131;133;132m[38;2;255;68;68m [38;2;255;68;68m✖[39m[38;2;131;133;132m[38;2;255;68;68m Failure:[39m[38;2;131;133;132m[39m
      [38;2;131;133;132m        [38;2;131;133;132mat evaluate
      (/home/piranna/github/projectlint/cli/__tests__/reports/tasktree.js:76:15)[39m[38;2;131;133;132m[39m
      [38;2;131;133;132m        [38;2;131;133;132mat func (/home/piranna/github/projectlint/cli/node_modules/@projectlint/
      projectlint/index.js:112:30)[39m[38;2;131;133;132m[39m
      [38;2;131;133;132m        [38;2;131;133;132mat /home/piranna/github/projectlint/cli/node_modules/@projectlint/tasks-
      engine/index.js:207:16[39m[38;2;131;133;132m[39m
      [38;2;131;133;132m        [38;2;131;133;132mat processTicksAndRejections (internal/process/task_queues.js:97:5)[39m[38;2;131;133;132m[39m
      ",
        "[?25h",
        "[?25l",
        "[?25h",
      ]
    `);
  });
});

test("error at warning level", function () {
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

  buffer = [];

  return cli(rules, config, "tasktree", { stdout }).then(function () {
    expect(buffer).toMatchInlineSnapshot(`
      Array [
        "[?25l",
        "  [38;2;66;133;244m❯[39m /home/piranna/github/projectlint/cli
      [38;2;131;133;132m  [38;2;46;46;46m›[39m[38;2;131;133;132m [38;2;255;68;68m✖[39m[38;2;131;133;132m [38;2;255;68;68mdumb[39m[38;2;131;133;132m [38;2;131;133;132m[error][39m[38;2;131;133;132m[39m
      [38;2;131;133;132m    [38;2;255;68;68m[38;2;46;46;46m─[39m[38;2;131;133;132m[38;2;255;68;68m [38;2;255;68;68m✖[39m[38;2;131;133;132m[38;2;255;68;68m Error:[39m[38;2;131;133;132m[39m
      [38;2;131;133;132m        [38;2;131;133;132mat evaluate
      (/home/piranna/github/projectlint/cli/__tests__/reports/tasktree.js:114:15)[39m[38;2;131;133;132m[39m
      [38;2;131;133;132m        [38;2;131;133;132mat func (/home/piranna/github/projectlint/cli/node_modules/@projectlint/
      projectlint/index.js:112:30)[39m[38;2;131;133;132m[39m
      [38;2;131;133;132m        [38;2;131;133;132mat /home/piranna/github/projectlint/cli/node_modules/@projectlint/tasks-
      engine/index.js:207:16[39m[38;2;131;133;132m[39m
      [38;2;131;133;132m        [38;2;131;133;132mat processTicksAndRejections (internal/process/task_queues.js:97:5)[39m[38;2;131;133;132m[39m
      ",
        "[?25h",
        "[?25l",
        "[?25h",
      ]
    `);
  });
});
