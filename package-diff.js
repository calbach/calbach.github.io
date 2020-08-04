const params = new URLSearchParams(document.location.search.substring(1));
const img = params.get('img') || 'terra-jupyter-aou';
const from = params.get('from');
const to = params.get('to');

const pkgSort = (a, b) => {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}


const renderDiff = async (urlA, urlB) => {
  const a = await (await fetch(urlA)).json();
  const b = await (await fetch(urlB)).json();
  
  const headers = Object.keys(a).sort();

  ReactDOM.render(
    <React.Fragment>
      {headers.map((h) => {
        const pkgs = Array.from(new Set(Object.keys(a[h]).concat(Object.keys(b[h]))));
        pkgs.sort(pkgSort);
        const add = [], rm = [], change = [];
        pkgs.forEach((p) => {
          if (!a[h][p] && b[h][p]) add.push(p); 
          else if (a[h][p] && !b[h][p]) rm.push(p);
          else if (a[h][p] !== b[h][p]) change.push(p);
        });
        return <React.Fragment>
          <h1>{h}</h1>
          <h2>Packages added:</h2>
          {add.map((p) => <div>
            {p}
          </div>)}
          <h2>Packages removed:</h2>
          {rm.map((p) => <div>
            {p}
          </div>)}
          <h2>Packages changed:</h2>
          {change.map((p) => <div>
            {p}: {a[h][p]} -> {b[h][p]}
          </div>)}
        </React.Fragment>;
      })}
    </React.Fragment>,
    document.getElementById('contents')
  );

};

if (!from || !to) {
  ReactDOM.render(<div>
      Please set query parameters <strong>from</strong> and <strong>to</strong>.
      <br/><a href={`?img=${img}&from=0.0.1&to=1.0.4`}>Example</a>
    </div>, document.getElementById('contents'));
} else {
  const urlA = `https://storage.googleapis.com/terra-docker-image-documentation/${img}-${from}-versions.json`;
  const urlB = `https://storage.googleapis.com/terra-docker-image-documentation/${img}-${to}-versions.json`;

  renderDiff(urlA, urlB);
}
