const computePaths = (paths) => {
    let computedPaths = [];
    paths.forEach(p => {
      //reduce path to array of scenes
      let path = p.scenes.map(s => s.scene)
      //check if a similar computed path exists
      const i = computedPaths.findIndex(d => _.isEqual(path, d.path));
      if(i==-1){
        computedPaths.push({
          path : path,
          entries : 1,
        })
      }else{
        computedPaths[i].entries+=1;
      }
    })
    paths.forEach(p => {
      p.proportion=(p.entries/computedPaths.reduce((a, b) => +a + +b.entries, 0))*100
    })
    console.log('computedpaths')
    console.log(computedPaths);
  }