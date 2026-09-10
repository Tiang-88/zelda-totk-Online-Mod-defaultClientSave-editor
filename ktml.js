(function (globalScope) {
  'use strict';

  class KTMLReader {
    constructor(source) {
      this.source = String(source).replace(/^\uFEFF/, '');
      this.index = 0;
      this.line = 1;
      this.column = 1;
    }

    eof() {
      return this.index >= this.source.length;
    }

    peek() {
      return this.source[this.index];
    }

    advance() {
      const character = this.source[this.index++];
      if (character === '\n') {
        this.line += 1;
        this.column = 1;
      } else {
        this.column += 1;
      }
      return character;
    }

    fail(message) {
      throw new SyntaxError(`${message} (line ${this.line}, column ${this.column})`);
    }

    skipWhitespace() {
      while (!this.eof() && /\s/.test(this.peek())) this.advance();
    }

    expect(character) {
      this.skipWhitespace();
      if (this.peek() !== character) this.fail(`Expected "${character}"`);
      this.advance();
    }

    readString() {
      this.skipWhitespace();
      if (this.peek() !== '"') this.fail('Expected a quoted string');
      let raw = this.advance();
      let escaped = false;
      while (!this.eof()) {
        const character = this.advance();
        raw += character;
        if (character === '"' && !escaped) {
          try {
            return JSON.parse(raw);
          } catch (error) {
            this.fail(`Invalid string: ${error.message}`);
          }
        }
        if (character === '\n' && !escaped) this.fail('Unterminated string');
        if (character === '\\' && !escaped) {
          escaped = true;
        } else {
          escaped = false;
        }
      }
      this.fail('Unterminated string');
    }

    readLiteral() {
      this.skipWhitespace();
      const start = this.index;
      while (!this.eof() && !/[\s{}:]/.test(this.peek())) this.advance();
      if (start === this.index) this.fail('Expected a value');
      const literal = this.source.slice(start, this.index);
      if (literal === 'true') return true;
      if (literal === 'false') return false;
      if (/^-?\d+$/.test(literal)) {
        const value = Number(literal);
        return Number.isSafeInteger(value) ? value : BigInt(literal);
      }
      if (/^-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(literal)) {
        const value = Number(literal);
        if (Number.isFinite(value)) return value;
      }
      this.fail(`Unsupported literal "${literal}"`);
    }

    readValue() {
      this.skipWhitespace();
      if (this.peek() === '"') return this.readString();
      if (this.peek() === '{') return this.readContainer();
      return this.readLiteral();
    }

    readContainer() {
      this.expect('{');
      this.skipWhitespace();
      if (this.peek() === '}') {
        this.advance();
        return [];
      }

      let isObject = false;
      if (this.peek() === '"') {
        const bookmark = { index: this.index, line: this.line, column: this.column };
        this.readString();
        this.skipWhitespace();
        isObject = this.peek() === ':';
        this.index = bookmark.index;
        this.line = bookmark.line;
        this.column = bookmark.column;
      }

      if (isObject) {
        const object = {};
        while (true) {
          this.skipWhitespace();
          if (this.peek() === '}') {
            this.advance();
            return object;
          }
          const key = this.readString();
          this.expect(':');
          object[key] = this.readValue();
        }
      }

      const array = [];
      while (true) {
        this.skipWhitespace();
        if (this.peek() === '}') {
          this.advance();
          return array;
        }
        array.push(this.readValue());
      }
    }

    readDocument() {
      const document = {};
      while (true) {
        this.skipWhitespace();
        if (this.eof()) return document;
        const key = this.readString();
        this.expect(':');
        document[key] = this.readValue();
      }
    }
  }

  function scalarToString(value) {
    if (typeof value === 'string') return JSON.stringify(value);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'bigint') return value.toString();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    throw new TypeError(`Cannot serialize KTML value of type ${typeof value}`);
  }

  function serializeValue(value, depth, newline) {
    const indent = '\t'.repeat(depth);
    const childIndent = '\t'.repeat(depth + 1);
    if (Array.isArray(value)) {
      if (!value.length) return '{}';
      return `{${newline}${value.map(item => `${childIndent}${serializeValue(item, depth + 1, newline)}`).join(newline)}${newline}${indent}}`;
    }
    if (value && typeof value === 'object') {
      const entries = Object.entries(value);
      if (!entries.length) return '{}';
      return `{${newline}${entries.map(([key, item]) => `${childIndent}${JSON.stringify(key)}: ${serializeValue(item, depth + 1, newline)}`).join(newline)}${newline}${indent}}`;
    }
    return scalarToString(value);
  }

  function parse(source) {
    return new KTMLReader(source).readDocument();
  }

  function stringify(document, options = {}) {
    if (!document || typeof document !== 'object' || Array.isArray(document)) {
      throw new TypeError('KTML document root must be an object');
    }
    const newline = options.newline || '\r\n';
    const output = Object.entries(document)
      .map(([key, value]) => `${JSON.stringify(key)}: ${serializeValue(value, 0, newline)}`)
      .join(newline);
    return `${output}${newline}`;
  }

  const API = { parse, stringify };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  globalScope.KTML = API;
}(typeof window !== 'undefined' ? window : globalThis));
