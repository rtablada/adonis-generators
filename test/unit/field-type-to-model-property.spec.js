'use strict';

/* global describe, it, before, beforeEach, after, context */
const chai = require('chai');
const expect = chai.expect;
const toModelProperty = require('../../src/helpers/field-type-to-model-property');

describe('fieldTypeToModelProperty', () => {
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
    expect(toModelProperty(fieldTypes.integer)).to
      .equal('');
    expect(toModelProperty(fieldTypes.string)).to
      .equal('');
    expect(toModelProperty(fieldTypes.boolean)).to
      .equal('');
  });
});
