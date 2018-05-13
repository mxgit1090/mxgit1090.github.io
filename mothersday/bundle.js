(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function () {
    'use strict';

    var pug = (function(exports){

      var pug_has_own_property = Object.prototype.hasOwnProperty;

      /**
       * Merge two attribute objects giving precedence
       * to values in object `b`. Classes are special-cased
       * allowing for arrays and merging/joining appropriately
       * resulting in a string.
       *
       * @param {Object} a
       * @param {Object} b
       * @return {Object} a
       * @api private
       */

      exports.merge = pug_merge;
      function pug_merge(a, b) {
        if (arguments.length === 1) {
          var attrs = a[0];
          for (var i = 1; i < a.length; i++) {
            attrs = pug_merge(attrs, a[i]);
          }
          return attrs;
        }

        for (var key in b) {
          if (key === 'class') {
            var valA = a[key] || [];
            a[key] = (Array.isArray(valA) ? valA : [valA]).concat(b[key] || []);
          } else if (key === 'style') {
            var valA = pug_style(a[key]);
            valA = valA && valA[valA.length - 1] !== ';' ? valA + ';' : valA;
            var valB = pug_style(b[key]);
            valB = valB && valB[valB.length - 1] !== ';' ? valB + ';' : valB;
            a[key] = valA + valB;
          } else {
            a[key] = b[key];
          }
        }

        return a;
      }
      /**
       * Process array, object, or string as a string of classes delimited by a space.
       *
       * If `val` is an array, all members of it and its subarrays are counted as
       * classes. If `escaping` is an array, then whether or not the item in `val` is
       * escaped depends on the corresponding item in `escaping`. If `escaping` is
       * not an array, no escaping is done.
       *
       * If `val` is an object, all the keys whose value is truthy are counted as
       * classes. No escaping is done.
       *
       * If `val` is a string, it is counted as a class. No escaping is done.
       *
       * @param {(Array.<string>|Object.<string, boolean>|string)} val
       * @param {?Array.<string>} escaping
       * @return {String}
       */
      exports.classes = pug_classes;
      function pug_classes_array(val, escaping) {
        var classString = '', className, padding = '', escapeEnabled = Array.isArray(escaping);
        for (var i = 0; i < val.length; i++) {
          className = pug_classes(val[i]);
          if (!className) continue;
          escapeEnabled && escaping[i] && (className = pug_escape(className));
          classString = classString + padding + className;
          padding = ' ';
        }
        return classString;
      }
      function pug_classes_object(val) {
        var classString = '', padding = '';
        for (var key in val) {
          if (key && val[key] && pug_has_own_property.call(val, key)) {
            classString = classString + padding + key;
            padding = ' ';
          }
        }
        return classString;
      }
      function pug_classes(val, escaping) {
        if (Array.isArray(val)) {
          return pug_classes_array(val, escaping);
        } else if (val && typeof val === 'object') {
          return pug_classes_object(val);
        } else {
          return val || '';
        }
      }

      /**
       * Convert object or string to a string of CSS styles delimited by a semicolon.
       *
       * @param {(Object.<string, string>|string)} val
       * @return {String}
       */

      exports.style = pug_style;
      function pug_style(val) {
        if (!val) return '';
        if (typeof val === 'object') {
          var out = '';
          for (var style in val) {
            /* istanbul ignore else */
            if (pug_has_own_property.call(val, style)) {
              out = out + style + ':' + val[style] + ';';
            }
          }
          return out;
        } else {
          return val + '';
        }
      }
      /**
       * Render the given attribute.
       *
       * @param {String} key
       * @param {String} val
       * @param {Boolean} escaped
       * @param {Boolean} terse
       * @return {String}
       */
      exports.attr = pug_attr;
      function pug_attr(key, val, escaped, terse) {
        if (val === false || val == null || !val && (key === 'class' || key === 'style')) {
          return '';
        }
        if (val === true) {
          return ' ' + (terse ? key : key + '="' + key + '"');
        }
        if (typeof val.toJSON === 'function') {
          val = val.toJSON();
        }
        if (typeof val !== 'string') {
          val = JSON.stringify(val);
          if (!escaped && val.indexOf('"') !== -1) {
            return ' ' + key + '=\'' + val.replace(/'/g, '&#39;') + '\'';
          }
        }
        if (escaped) val = pug_escape(val);
        return ' ' + key + '="' + val + '"';
      }
      /**
       * Render the given attributes object.
       *
       * @param {Object} obj
       * @param {Object} terse whether to use HTML5 terse boolean attributes
       * @return {String}
       */
      exports.attrs = pug_attrs;
      function pug_attrs(obj, terse){
        var attrs = '';

        for (var key in obj) {
          if (pug_has_own_property.call(obj, key)) {
            var val = obj[key];

            if ('class' === key) {
              val = pug_classes(val);
              attrs = pug_attr(key, val, false, terse) + attrs;
              continue;
            }
            if ('style' === key) {
              val = pug_style(val);
            }
            attrs += pug_attr(key, val, false, terse);
          }
        }

        return attrs;
      }
      /**
       * Escape the given string of `html`.
       *
       * @param {String} html
       * @return {String}
       * @api private
       */

      var pug_match_html = /["&<>]/;
      exports.escape = pug_escape;
      function pug_escape(_html){
        var html = '' + _html;
        var regexResult = pug_match_html.exec(html);
        if (!regexResult) return _html;

        var result = '';
        var i, lastIndex, escape;
        for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {
          switch (html.charCodeAt(i)) {
            case 34: escape = '&quot;'; break;
            case 38: escape = '&amp;'; break;
            case 60: escape = '&lt;'; break;
            case 62: escape = '&gt;'; break;
            default: continue;
          }
          if (lastIndex !== i) result += html.substring(lastIndex, i);
          lastIndex = i + 1;
          result += escape;
        }
        if (lastIndex !== i) return result + html.substring(lastIndex, i);
        else return result;
      }
      /**
       * Re-throw the given `err` in context to the
       * the pug in `filename` at the given `lineno`.
       *
       * @param {Error} err
       * @param {String} filename
       * @param {String} lineno
       * @param {String} str original source
       * @api private
       */

      exports.rethrow = pug_rethrow;
      function pug_rethrow(err, filename, lineno, str){
        if (!(err instanceof Error)) throw err;
        if ((typeof window != 'undefined' || !filename) && !str) {
          err.message += ' on line ' + lineno;
          throw err;
        }
        try {
          str = str || require('fs').readFileSync(filename, 'utf8');
        } catch (ex) {
          pug_rethrow(err, null, lineno);
        }
        var context = 3
          , lines = str.split('\n')
          , start = Math.max(lineno - context, 0)
          , end = Math.min(lines.length, lineno + context);

        // Error context
        var context = lines.slice(start, end).map(function(line, i){
          var curr = i + start + 1;
          return (curr == lineno ? '  > ' : '    ')
            + curr
            + '| '
            + line;
        }).join('\n');

        // Alter exception message
        err.path = filename;
        err.message = (filename || 'Pug') + ':' + lineno
          + '\n' + context + '\n\n' + err.message;
        throw err;
      }
      return exports
    })({});

    function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
    pug_mixins["heart"] = pug_interp = function(){
    var block = (this && this.block), attributes = (this && this.attributes) || {};
    pug_html = pug_html + "\u003Csvg class=\"heart\" viewbox=\"-12 -3 48 48\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\"\u003E";
    for (var i = 0; i < 8; i++) 
    {
    pug_html = pug_html + "\u003Cpath d=\"M12,21.5c-3.36-2.44-6.62-4.94-8.74-8.61a8,8,0,0,1-.9-6.73,5.29,5.29,0,0,1,8.94-1.95c.2.24.42.47.71.78l.52-.62a5.47,5.47,0,0,1,6-1.53A5.77,5.77,0,0,1,22,8a9.76,9.76,0,0,1-2.14,6.32A33.17,33.17,0,0,1,12,21.5\"\u003E\u003C\u002Fpath\u003E";
    }
    pug_html = pug_html + "\u003C\u002Fsvg\u003E";
    };
    pug_html = pug_html + "\u003Csvg class=\"container\"\u003E";
    var title = '母親節快樂';
    pug_html = pug_html + "\u003Ctext x=\"50%\" y=\"50%\"\u003E";
    (function(){
      var $$obj = title;
      if ('number' == typeof $$obj.length) {
          for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
            var c = $$obj[pug_index0];
    pug_html = pug_html + "\u003Ctspan\u003E";
    pug_html = pug_html + (pug.escape(null == (pug_interp = c) ? "" : pug_interp)) + "\u003C\u002Ftspan\u003E";
          }
      } else {
        var $$l = 0;
        for (var pug_index0 in $$obj) {
          $$l++;
          var c = $$obj[pug_index0];
    pug_html = pug_html + "\u003Ctspan\u003E";
    pug_html = pug_html + (pug.escape(null == (pug_interp = c) ? "" : pug_interp)) + "\u003C\u002Ftspan\u003E";
        }
      }
    }).call(this);

    pug_html = pug_html + "\u003C\u002Ftext\u003E\u003C\u002Fsvg\u003E";
    pug_html = pug_html + "\u003Cdiv class=\"flowerfall\"\u003E";
    for (var i = 0; i < 20; i++)
    {
    pug_mixins["heart"]();
    }
    pug_html = pug_html + "\u003C\u002Fdiv\u003E";} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

    const context = { message: 'Hello World' };

    if (document && document.body) {
        const main = document.getElementById('main');
        console.log(main);
        main.innerHTML = template(context);
    }

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJub2RlX21vZHVsZXMvcm9sbHVwLXBsdWdpbi1wdWcvZGlzdC9ydW50aW1lLmVzLmpzIiwic3JjL3ZpZXdzL3RlbXBsYXRlLnB1ZyIsInNyYy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbihleHBvcnRzKXtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBwdWdfaGFzX293bl9wcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbiAgLyoqXG4gICAqIE1lcmdlIHR3byBhdHRyaWJ1dGUgb2JqZWN0cyBnaXZpbmcgcHJlY2VkZW5jZVxuICAgKiB0byB2YWx1ZXMgaW4gb2JqZWN0IGBiYC4gQ2xhc3NlcyBhcmUgc3BlY2lhbC1jYXNlZFxuICAgKiBhbGxvd2luZyBmb3IgYXJyYXlzIGFuZCBtZXJnaW5nL2pvaW5pbmcgYXBwcm9wcmlhdGVseVxuICAgKiByZXN1bHRpbmcgaW4gYSBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBiXG4gICAqIEByZXR1cm4ge09iamVjdH0gYVxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZXhwb3J0cy5tZXJnZSA9IHB1Z19tZXJnZTtcbiAgZnVuY3Rpb24gcHVnX21lcmdlKGEsIGIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIGF0dHJzID0gYVswXTtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgICBhdHRycyA9IHB1Z19tZXJnZShhdHRycywgYVtpXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYXR0cnM7XG4gICAgfVxuXG4gICAgZm9yICh2YXIga2V5IGluIGIpIHtcbiAgICAgIGlmIChrZXkgPT09ICdjbGFzcycpIHtcbiAgICAgICAgdmFyIHZhbEEgPSBhW2tleV0gfHwgW107XG4gICAgICAgIGFba2V5XSA9IChBcnJheS5pc0FycmF5KHZhbEEpID8gdmFsQSA6IFt2YWxBXSkuY29uY2F0KGJba2V5XSB8fCBbXSk7XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgICAgICB2YXIgdmFsQSA9IHB1Z19zdHlsZShhW2tleV0pO1xuICAgICAgICB2YWxBID0gdmFsQSAmJiB2YWxBW3ZhbEEubGVuZ3RoIC0gMV0gIT09ICc7JyA/IHZhbEEgKyAnOycgOiB2YWxBO1xuICAgICAgICB2YXIgdmFsQiA9IHB1Z19zdHlsZShiW2tleV0pO1xuICAgICAgICB2YWxCID0gdmFsQiAmJiB2YWxCW3ZhbEIubGVuZ3RoIC0gMV0gIT09ICc7JyA/IHZhbEIgKyAnOycgOiB2YWxCO1xuICAgICAgICBhW2tleV0gPSB2YWxBICsgdmFsQjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFba2V5XSA9IGJba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYTtcbiAgfTtcblxuICAvKipcbiAgICogUHJvY2VzcyBhcnJheSwgb2JqZWN0LCBvciBzdHJpbmcgYXMgYSBzdHJpbmcgb2YgY2xhc3NlcyBkZWxpbWl0ZWQgYnkgYSBzcGFjZS5cbiAgICpcbiAgICogSWYgYHZhbGAgaXMgYW4gYXJyYXksIGFsbCBtZW1iZXJzIG9mIGl0IGFuZCBpdHMgc3ViYXJyYXlzIGFyZSBjb3VudGVkIGFzXG4gICAqIGNsYXNzZXMuIElmIGBlc2NhcGluZ2AgaXMgYW4gYXJyYXksIHRoZW4gd2hldGhlciBvciBub3QgdGhlIGl0ZW0gaW4gYHZhbGAgaXNcbiAgICogZXNjYXBlZCBkZXBlbmRzIG9uIHRoZSBjb3JyZXNwb25kaW5nIGl0ZW0gaW4gYGVzY2FwaW5nYC4gSWYgYGVzY2FwaW5nYCBpc1xuICAgKiBub3QgYW4gYXJyYXksIG5vIGVzY2FwaW5nIGlzIGRvbmUuXG4gICAqXG4gICAqIElmIGB2YWxgIGlzIGFuIG9iamVjdCwgYWxsIHRoZSBrZXlzIHdob3NlIHZhbHVlIGlzIHRydXRoeSBhcmUgY291bnRlZCBhc1xuICAgKiBjbGFzc2VzLiBObyBlc2NhcGluZyBpcyBkb25lLlxuICAgKlxuICAgKiBJZiBgdmFsYCBpcyBhIHN0cmluZywgaXQgaXMgY291bnRlZCBhcyBhIGNsYXNzLiBObyBlc2NhcGluZyBpcyBkb25lLlxuICAgKlxuICAgKiBAcGFyYW0geyhBcnJheS48c3RyaW5nPnxPYmplY3QuPHN0cmluZywgYm9vbGVhbj58c3RyaW5nKX0gdmFsXG4gICAqIEBwYXJhbSB7P0FycmF5LjxzdHJpbmc+fSBlc2NhcGluZ1xuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBleHBvcnRzLmNsYXNzZXMgPSBwdWdfY2xhc3NlcztcbiAgZnVuY3Rpb24gcHVnX2NsYXNzZXNfYXJyYXkodmFsLCBlc2NhcGluZykge1xuICAgIHZhciBjbGFzc1N0cmluZyA9ICcnLCBjbGFzc05hbWUsIHBhZGRpbmcgPSAnJywgZXNjYXBlRW5hYmxlZCA9IEFycmF5LmlzQXJyYXkoZXNjYXBpbmcpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjbGFzc05hbWUgPSBwdWdfY2xhc3Nlcyh2YWxbaV0pO1xuICAgICAgaWYgKCFjbGFzc05hbWUpIGNvbnRpbnVlO1xuICAgICAgZXNjYXBlRW5hYmxlZCAmJiBlc2NhcGluZ1tpXSAmJiAoY2xhc3NOYW1lID0gcHVnX2VzY2FwZShjbGFzc05hbWUpKTtcbiAgICAgIGNsYXNzU3RyaW5nID0gY2xhc3NTdHJpbmcgKyBwYWRkaW5nICsgY2xhc3NOYW1lO1xuICAgICAgcGFkZGluZyA9ICcgJztcbiAgICB9XG4gICAgcmV0dXJuIGNsYXNzU3RyaW5nO1xuICB9XG4gIGZ1bmN0aW9uIHB1Z19jbGFzc2VzX29iamVjdCh2YWwpIHtcbiAgICB2YXIgY2xhc3NTdHJpbmcgPSAnJywgcGFkZGluZyA9ICcnO1xuICAgIGZvciAodmFyIGtleSBpbiB2YWwpIHtcbiAgICAgIGlmIChrZXkgJiYgdmFsW2tleV0gJiYgcHVnX2hhc19vd25fcHJvcGVydHkuY2FsbCh2YWwsIGtleSkpIHtcbiAgICAgICAgY2xhc3NTdHJpbmcgPSBjbGFzc1N0cmluZyArIHBhZGRpbmcgKyBrZXk7XG4gICAgICAgIHBhZGRpbmcgPSAnICc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjbGFzc1N0cmluZztcbiAgfVxuICBmdW5jdGlvbiBwdWdfY2xhc3Nlcyh2YWwsIGVzY2FwaW5nKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSkge1xuICAgICAgcmV0dXJuIHB1Z19jbGFzc2VzX2FycmF5KHZhbCwgZXNjYXBpbmcpO1xuICAgIH0gZWxzZSBpZiAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gcHVnX2NsYXNzZXNfb2JqZWN0KHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWwgfHwgJyc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgb2JqZWN0IG9yIHN0cmluZyB0byBhIHN0cmluZyBvZiBDU1Mgc3R5bGVzIGRlbGltaXRlZCBieSBhIHNlbWljb2xvbi5cbiAgICpcbiAgICogQHBhcmFtIHsoT2JqZWN0LjxzdHJpbmcsIHN0cmluZz58c3RyaW5nKX0gdmFsXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG5cbiAgZXhwb3J0cy5zdHlsZSA9IHB1Z19zdHlsZTtcbiAgZnVuY3Rpb24gcHVnX3N0eWxlKHZhbCkge1xuICAgIGlmICghdmFsKSByZXR1cm4gJyc7XG4gICAgaWYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICB2YXIgb3V0ID0gJyc7XG4gICAgICBmb3IgKHZhciBzdHlsZSBpbiB2YWwpIHtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgaWYgKHB1Z19oYXNfb3duX3Byb3BlcnR5LmNhbGwodmFsLCBzdHlsZSkpIHtcbiAgICAgICAgICBvdXQgPSBvdXQgKyBzdHlsZSArICc6JyArIHZhbFtzdHlsZV0gKyAnOyc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWwgKyAnJztcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAgICogQHBhcmFtIHtCb29sZWFufSBlc2NhcGVkXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gdGVyc2VcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgZXhwb3J0cy5hdHRyID0gcHVnX2F0dHI7XG4gIGZ1bmN0aW9uIHB1Z19hdHRyKGtleSwgdmFsLCBlc2NhcGVkLCB0ZXJzZSkge1xuICAgIGlmICh2YWwgPT09IGZhbHNlIHx8IHZhbCA9PSBudWxsIHx8ICF2YWwgJiYgKGtleSA9PT0gJ2NsYXNzJyB8fCBrZXkgPT09ICdzdHlsZScpKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmICh2YWwgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiAnICcgKyAodGVyc2UgPyBrZXkgOiBrZXkgKyAnPVwiJyArIGtleSArICdcIicpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHZhbC50b0pTT04gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHZhbCA9IHZhbC50b0pTT04oKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB2YWwgIT09ICdzdHJpbmcnKSB7XG4gICAgICB2YWwgPSBKU09OLnN0cmluZ2lmeSh2YWwpO1xuICAgICAgaWYgKCFlc2NhcGVkICYmIHZhbC5pbmRleE9mKCdcIicpICE9PSAtMSkge1xuICAgICAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cXCcnICsgdmFsLnJlcGxhY2UoLycvZywgJyYjMzk7JykgKyAnXFwnJztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVzY2FwZWQpIHZhbCA9IHB1Z19lc2NhcGUodmFsKTtcbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZXMgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0ZXJzZSB3aGV0aGVyIHRvIHVzZSBIVE1MNSB0ZXJzZSBib29sZWFuIGF0dHJpYnV0ZXNcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgZXhwb3J0cy5hdHRycyA9IHB1Z19hdHRycztcbiAgZnVuY3Rpb24gcHVnX2F0dHJzKG9iaiwgdGVyc2Upe1xuICAgIHZhciBhdHRycyA9ICcnO1xuXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKHB1Z19oYXNfb3duX3Byb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgIHZhciB2YWwgPSBvYmpba2V5XTtcblxuICAgICAgICBpZiAoJ2NsYXNzJyA9PT0ga2V5KSB7XG4gICAgICAgICAgdmFsID0gcHVnX2NsYXNzZXModmFsKTtcbiAgICAgICAgICBhdHRycyA9IHB1Z19hdHRyKGtleSwgdmFsLCBmYWxzZSwgdGVyc2UpICsgYXR0cnM7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdzdHlsZScgPT09IGtleSkge1xuICAgICAgICAgIHZhbCA9IHB1Z19zdHlsZSh2YWwpO1xuICAgICAgICB9XG4gICAgICAgIGF0dHJzICs9IHB1Z19hdHRyKGtleSwgdmFsLCBmYWxzZSwgdGVyc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhdHRycztcbiAgfTtcblxuICAvKipcbiAgICogRXNjYXBlIHRoZSBnaXZlbiBzdHJpbmcgb2YgYGh0bWxgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaHRtbFxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICB2YXIgcHVnX21hdGNoX2h0bWwgPSAvW1wiJjw+XS87XG4gIGV4cG9ydHMuZXNjYXBlID0gcHVnX2VzY2FwZTtcbiAgZnVuY3Rpb24gcHVnX2VzY2FwZShfaHRtbCl7XG4gICAgdmFyIGh0bWwgPSAnJyArIF9odG1sO1xuICAgIHZhciByZWdleFJlc3VsdCA9IHB1Z19tYXRjaF9odG1sLmV4ZWMoaHRtbCk7XG4gICAgaWYgKCFyZWdleFJlc3VsdCkgcmV0dXJuIF9odG1sO1xuXG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHZhciBpLCBsYXN0SW5kZXgsIGVzY2FwZTtcbiAgICBmb3IgKGkgPSByZWdleFJlc3VsdC5pbmRleCwgbGFzdEluZGV4ID0gMDsgaSA8IGh0bWwubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN3aXRjaCAoaHRtbC5jaGFyQ29kZUF0KGkpKSB7XG4gICAgICAgIGNhc2UgMzQ6IGVzY2FwZSA9ICcmcXVvdDsnOyBicmVhaztcbiAgICAgICAgY2FzZSAzODogZXNjYXBlID0gJyZhbXA7JzsgYnJlYWs7XG4gICAgICAgIGNhc2UgNjA6IGVzY2FwZSA9ICcmbHQ7JzsgYnJlYWs7XG4gICAgICAgIGNhc2UgNjI6IGVzY2FwZSA9ICcmZ3Q7JzsgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6IGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKGxhc3RJbmRleCAhPT0gaSkgcmVzdWx0ICs9IGh0bWwuc3Vic3RyaW5nKGxhc3RJbmRleCwgaSk7XG4gICAgICBsYXN0SW5kZXggPSBpICsgMTtcbiAgICAgIHJlc3VsdCArPSBlc2NhcGU7XG4gICAgfVxuICAgIGlmIChsYXN0SW5kZXggIT09IGkpIHJldHVybiByZXN1bHQgKyBodG1sLnN1YnN0cmluZyhsYXN0SW5kZXgsIGkpO1xuICAgIGVsc2UgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvKipcbiAgICogUmUtdGhyb3cgdGhlIGdpdmVuIGBlcnJgIGluIGNvbnRleHQgdG8gdGhlXG4gICAqIHRoZSBwdWcgaW4gYGZpbGVuYW1lYCBhdCB0aGUgZ2l2ZW4gYGxpbmVub2AuXG4gICAqXG4gICAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWVcbiAgICogQHBhcmFtIHtTdHJpbmd9IGxpbmVub1xuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIG9yaWdpbmFsIHNvdXJjZVxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZXhwb3J0cy5yZXRocm93ID0gcHVnX3JldGhyb3c7XG4gIGZ1bmN0aW9uIHB1Z19yZXRocm93KGVyciwgZmlsZW5hbWUsIGxpbmVubywgc3RyKXtcbiAgICBpZiAoIShlcnIgaW5zdGFuY2VvZiBFcnJvcikpIHRocm93IGVycjtcbiAgICBpZiAoKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgfHwgIWZpbGVuYW1lKSAmJiAhc3RyKSB7XG4gICAgICBlcnIubWVzc2FnZSArPSAnIG9uIGxpbmUgJyArIGxpbmVubztcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHN0ciA9IHN0ciB8fCByZXF1aXJlKCdmcycpLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0ZjgnKVxuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICBwdWdfcmV0aHJvdyhlcnIsIG51bGwsIGxpbmVubylcbiAgICB9XG4gICAgdmFyIGNvbnRleHQgPSAzXG4gICAgICAsIGxpbmVzID0gc3RyLnNwbGl0KCdcXG4nKVxuICAgICAgLCBzdGFydCA9IE1hdGgubWF4KGxpbmVubyAtIGNvbnRleHQsIDApXG4gICAgICAsIGVuZCA9IE1hdGgubWluKGxpbmVzLmxlbmd0aCwgbGluZW5vICsgY29udGV4dCk7XG5cbiAgICAvLyBFcnJvciBjb250ZXh0XG4gICAgdmFyIGNvbnRleHQgPSBsaW5lcy5zbGljZShzdGFydCwgZW5kKS5tYXAoZnVuY3Rpb24obGluZSwgaSl7XG4gICAgICB2YXIgY3VyciA9IGkgKyBzdGFydCArIDE7XG4gICAgICByZXR1cm4gKGN1cnIgPT0gbGluZW5vID8gJyAgPiAnIDogJyAgICAnKVxuICAgICAgICArIGN1cnJcbiAgICAgICAgKyAnfCAnXG4gICAgICAgICsgbGluZTtcbiAgICB9KS5qb2luKCdcXG4nKTtcblxuICAgIC8vIEFsdGVyIGV4Y2VwdGlvbiBtZXNzYWdlXG4gICAgZXJyLnBhdGggPSBmaWxlbmFtZTtcbiAgICBlcnIubWVzc2FnZSA9IChmaWxlbmFtZSB8fCAnUHVnJykgKyAnOicgKyBsaW5lbm9cbiAgICAgICsgJ1xcbicgKyBjb250ZXh0ICsgJ1xcblxcbicgKyBlcnIubWVzc2FnZTtcbiAgICB0aHJvdyBlcnI7XG4gIH07XG5cbiAgcmV0dXJuIGV4cG9ydHNcbn0pKHt9KTtcbiIsImluY2x1ZGUgaGVhcnQucHVnXG5cbnN2Zy5jb250YWluZXJcbiAgICAtIHZhciB0aXRsZSA9ICfmr43opqrnr4Dlv6vmqIInO1xuICAgIHRleHQoXG4gICAgICAgIHg9XCI1MCVcIiBcbiAgICAgICAgeT1cIjUwJVwiXG4gICAgKVxuICAgICAgICBlYWNoIGMgaW4gdGl0bGVcbiAgICAgICAgICAgIHRzcGFuPSBjXG5cbi5mbG93ZXJmYWxsXG4gICAgLSBmb3IgKHZhciBpID0gMDsgaSA8IDIwOyBpKyspXG4gICAgICAgICtoZWFydCgpXG5cbiIsImltcG9ydCAnLi9zdHlsZXMvbWFpbi5zY3NzJztcbmltcG9ydCB0ZW1wbGF0ZSBmcm9tICcuL3ZpZXdzL3RlbXBsYXRlLnB1Zyc7XG5cbmNvbnN0IGNvbnRleHQgPSB7IG1lc3NhZ2U6ICdIZWxsbyBXb3JsZCcgfTtcblxuaWYgKGRvY3VtZW50ICYmIGRvY3VtZW50LmJvZHkpIHtcbiAgICBjb25zdCBtYWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4nKTtcbiAgICBjb25zb2xlLmxvZyhtYWluKTtcbiAgICBtYWluLmlubmVySFRNTCA9IHRlbXBsYXRlKGNvbnRleHQpO1xufSJdLCJuYW1lcyI6W10sIm1hcHBpbmdz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
