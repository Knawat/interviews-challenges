"use strict"

module.exports = (serviceNames)=>{
  let events ={};
  serviceNames.forEach(name=>{
      events[`cache.clean.${name}`]=()=>{
          if(this.broker.cacher){
              this.logger.debug(`Clear local cache ${name}`);
              this.broker.cacher.clean(`${name}.*`);
          }
      }
  });
  return {
      events
  };
}