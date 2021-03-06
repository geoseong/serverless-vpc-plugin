const { DB_SUBNET } = require('./constants');

const validSubnetGroups = ['rds', 'redshift', 'elasticache', 'dax'];

/**
 * Build an RDSubnetGroup for a given number of zones
 *
 * @param {Number} numZones Number of availability zones
 * @param {Objects} params
 * @return {Object}
 */
function buildRDSSubnetGroup(numZones = 0, { name = 'RDSSubnetGroup' } = {}) {
  if (numZones < 1) {
    return {};
  }

  const subnetIds = [];
  for (let i = 1; i <= numZones; i += 1) {
    subnetIds.push({ Ref: `${DB_SUBNET}Subnet${i}` });
  }

  return {
    [name]: {
      Type: 'AWS::RDS::DBSubnetGroup',
      Properties: {
        DBSubnetGroupName: {
          Ref: 'AWS::StackName',
        },
        DBSubnetGroupDescription: {
          Ref: 'AWS::StackName',
        },
        SubnetIds: subnetIds,
      },
    },
  };
}

/**
 * Build an ElastiCacheSubnetGroup for a given number of zones
 *
 * @param {Number} numZones Number of availability zones
 * @param {Object} params
 * @return {Object}
 */
function buildElastiCacheSubnetGroup(numZones = 0, { name = 'ElastiCacheSubnetGroup' } = {}) {
  if (numZones < 1) {
    return {};
  }

  const subnetIds = [];
  for (let i = 1; i <= numZones; i += 1) {
    subnetIds.push({ Ref: `${DB_SUBNET}Subnet${i}` });
  }

  return {
    [name]: {
      Type: 'AWS::ElastiCache::SubnetGroup',
      Properties: {
        CacheSubnetGroupName: {
          Ref: 'AWS::StackName',
        },
        Description: {
          Ref: 'AWS::StackName',
        },
        SubnetIds: subnetIds,
      },
    },
  };
}

/**
 * Build an RedshiftSubnetGroup for a given number of zones
 *
 * @param {Number} numZones Number of availability zones
 * @param {Object} params
 * @return {Object}
 */
function buildRedshiftSubnetGroup(numZones = 0, { name = 'RedshiftSubnetGroup' } = {}) {
  if (numZones < 1) {
    return {};
  }

  const subnetIds = [];
  for (let i = 1; i <= numZones; i += 1) {
    subnetIds.push({ Ref: `${DB_SUBNET}Subnet${i}` });
  }

  return {
    [name]: {
      Type: 'AWS::Redshift::ClusterSubnetGroup',
      Properties: {
        Description: {
          Ref: 'AWS::StackName',
        },
        SubnetIds: subnetIds,
      },
    },
  };
}

/**
 * Build an DAXSubnetGroup for a given number of zones
 *
 * @param {Number} numZones Number of availability zones
 * @param {Object} params
 * @return {Object}
 */
function buildDAXSubnetGroup(numZones = 0, { name = 'DAXSubnetGroup' } = {}) {
  if (numZones < 1) {
    return {};
  }

  const subnetIds = [];
  for (let i = 1; i <= numZones; i += 1) {
    subnetIds.push({ Ref: `${DB_SUBNET}Subnet${i}` });
  }

  return {
    [name]: {
      Type: 'AWS::DAX::SubnetGroup',
      Properties: {
        SubnetGroupName: {
          Ref: 'AWS::StackName',
        },
        Description: {
          Ref: 'AWS::StackName',
        },
        SubnetIds: subnetIds,
      },
    },
  };
}

/**
 * Build the database subnet groups
 *
 * @param {Number} numZones Number of availability zones
 * @param {Array} subnetGroups options of subnet groups
 * @return {Object}
 */
function buildSubnetGroups(numZones = 0, subnetGroups = []) {
  if (numZones < 2) {
    return {};
  }
  const subnetGroupList = {
    rds: buildRDSSubnetGroup,
    redshift: buildRedshiftSubnetGroup,
    elasticache: buildElastiCacheSubnetGroup,
    dax: buildDAXSubnetGroup,
  };
  function assembleSubnetGrp(acc, service) {
    const builtSubnetGroup = subnetGroupList[service.toLowerCase()](numZones);
    return Object.assign(acc, builtSubnetGroup);
  }

  if (subnetGroups.length > 0) {
    return subnetGroups.reduce(assembleSubnetGrp, {});
  }
  return Object.assign(
    {},
    buildRDSSubnetGroup(numZones),
    buildRedshiftSubnetGroup(numZones),
    buildElastiCacheSubnetGroup(numZones),
    buildDAXSubnetGroup(numZones),
  );
}

module.exports = {
  buildDAXSubnetGroup,
  buildElastiCacheSubnetGroup,
  buildRDSSubnetGroup,
  buildRedshiftSubnetGroup,
  buildSubnetGroups,
  validSubnetGroups,
};
