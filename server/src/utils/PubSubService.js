module.exports = {
  
  handlers: {},
  
  subscribe(name, handler, scope) {
    const me = this;
    const handle = {
      handler,
      scope: scope || me
    };
    
    if (!me.handlers[name]) {
      me.handlers[name] = [];
    }
    me.handlers[name].push(handle);
    return me;
  },
  
  publish(event, ...args) {
    const me = this;
    if (me.handlers[event]) {
      if (me.handlers[event].length > 0) {
        me.handlers[event].forEach((item) => {
          item.handler.apply(item.scope, args);
        });
      }
    }
    return me;
  },
  
  unsubscribe(evt, scope) {
    if (this.handlers[evt]) {
      this.handlers[evt] = this.handlers[evt].filter(event => event.scope !== scope);
    }
  },
  
  unsubscribeAll(scope) {
    Object.keys(this.handlers).forEach((eventName) => {
      this.unsubscribe(eventName, scope);
    })
  }
};



