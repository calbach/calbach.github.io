const octokit = Octokit();

const until = new Date();
until.setDate(until.getDate() - ((until.getDay() - 1) % 7));
until.setHours(0);
until.setMinutes(0);
until.setSeconds(0);
until.setMilliseconds(0);

const since = new Date(until - 7 * 24 * 60 * 60 * 1000);

[[since, until], [until, new Date()]].forEach(([from, to]) => {

// TODO: Grab from all recent repos.
octokit.repos.getCommits({
  owner: "all-of-us",
  repo: "workbench",
  author: "calbach",
  per_page: 128,
  since: from,
  until: to
}).then(result => {
  const contentsEl = document.getElementById("contents");
  const h2 = document.createElement('h2');
  h2.textContent = `Week of ${from.toDateString()}`;
  const p = document.createElement('p');
  contentsEl.append(h2);
  contentsEl.append(p);
  
  const prRe = /^(.*) \(#(\d+)\)$/;
  result.data
    .map(r => {
      const msg = r.commit.message.split('\n')[0];
      const match = msg.match(prRe);
      if (!match) {
        return msg;
      }
      return `[#${match[2]}](https://github.com/all-of-us/workbench/pull/${match[2]}) ${match[1]}`;
    })
    .forEach(line => {
      contentsEl.append(`- ${line}\n`);
    });
});
  
});
