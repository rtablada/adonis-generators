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
    belongsToWithModel: {
      name: 'groups',
      type: 'relation',
      raw: 'groups:hasMany:Cohort:instructor_id',
      relation: {
        type: 'hasMany',
        modelName: 'Cohort',
        foreignKey: 'instructor_id',
      },
    },
    belongsToWithForeignKey: {
      name: 'author',
      type: 'relation',
      raw: 'author:belongsTo:User',
      relation: {
        type: 'belongsTo',
        modelName: 'User',
        foreignKey: 'user_id',
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
    hasManyWithModel: {
      name: 'post',
      type: 'relation',
      raw: 'post:belongsTo',
      relation: {
        type: 'belongsTo',
        modelName: 'Post',
        foreignKey: 'post_id',
      },
    },
    hasManyWithForeignKey: {
      name: 'dogs',
      type: 'relation',
      raw: 'dogs:hasMany',
      relation: {
        type: 'hasMany',
        modelName: 'Dog',
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

  it('should know how to parse belongsTo relationships with all fields', () => {
  });

  it('should know how to parse hasMany relationships with all fields', () => {
  });

  it('should know how to parse belongsTo relationships with no foreignKey', () => {
  });

  it('should know how to parse hasMany relationships with no foreignKey', () => {
  });

  it('should know how to parse belongsTo relationships with no model', () => {
  });

  it('should know how to parse hasMany relationships with no model', () => {
  });
});
