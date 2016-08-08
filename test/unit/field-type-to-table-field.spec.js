'use strict';

/* global describe, it, before, beforeEach, after, context */
const chai = require('chai');
const expect = chai.expect;
const toTableField = require('../../src/helpers/field-type-to-table-field');

describe('fieldTypeToTableField', () => {
  const fieldTypes = {
    integer: {
      name: 'age',
      type: 'integer',
      raw: 'age:integer',
      relation: undefined,
    },
    string: {
      name: 'name',
      type: 'string',
      raw: 'name:string',
      relation: undefined,
    },
    boolean: {
      name: 'drive',
      type: 'boolean',
      raw: 'drive:boolean',
      relation: undefined,
    },

    belongsTo: {
      name: 'teacher',
      type: 'relation',
      raw: 'teacher:belongsTo:User:instructor_id',
      relation: {
        type: 'belongsTo',
        modelName: 'User',
        foreignKey: 'instructor_id',
      },
    },

    hasMany: {
      name: 'startups',
      type: 'relation',
      raw: 'startups:hasMany:Business',
      relation: {
        type: 'hasMany',
        modelName: 'Business',
        foreignKey: 'pokemon_id',
      },
    },
  };

  it('should know how to parse raw data types', () => {
    expect(toTableField(fieldTypes.integer)).to
      .equal('table.integer(\'age\');');
    expect(toTableField(fieldTypes.string)).to
      .equal('table.string(\'name\');');
    expect(toTableField(fieldTypes.boolean)).to
      .equal('table.boolean(\'drive\');');
  });

  it('should know how to parse belongsTo relationships', () => {
    expect(toTableField(fieldTypes.belongsTo)).to
      .equal("table.integer('instructor_id').references('users.id');");
  });

  it('should know how to parse hasMany relationships', () => {
    expect(toTableField(fieldTypes.hasMany)).to.equal('');
  });
});
