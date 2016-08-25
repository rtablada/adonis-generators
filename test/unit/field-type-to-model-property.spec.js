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

    hasOne: {
      name: 'pet',
      type: 'relation',
      raw: 'pet:hasOne:Dog',
      relation: {
        type: 'hasOne',
        modelName: 'Dog',
        foreignKey: 'dog_id',
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

  it('should know how to parse belongsTo relationships', () => {
    expect(toModelProperty(fieldTypes.belongsTo)).to.equal(
      "teacher() {\n    return this.belongsTo('App/Model/User', 'id', 'instructor_id');\n  }");
  });

  it('should know how to parse hasMany relationships', () => {
    expect(toModelProperty(fieldTypes.hasMany)).to.equal(
      "startups() {\n    return this.hasMany('App/Model/Business', 'id', 'pokemon_id');\n  }");
  });

  it('should know how to parse hasOne relationships', () => {
    expect(toModelProperty(fieldTypes.hasOne)).to.equal(
      "pet() {\n    return this.hasOne('App/Model/Dog', 'id', 'dog_id');\n  }");
  });
});
