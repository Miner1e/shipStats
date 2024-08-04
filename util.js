async function read(path){
  const res = await fetch(path);
  const json = await res.json();
  return json;
    /*(fetch("./content/stats/ships.json").then((res) => {
        return res.json();
      }).then((data => {
        return data;
      })));*/
}
export { read };