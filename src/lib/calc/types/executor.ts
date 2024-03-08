export enum E_EXECUTOR_FUNCTION_NAMES {
  ABS = 'abs', // Absolute value
  CEIL = 'ceil', // Ceiling value
  FLOOR = 'floor', // Floor value
  ROUND = 'round', // Round value

  // Trigonometric functions
  SIN = 'sin', // Sine
  COS = 'cos', // Cosine
  TAN = 'tan', // Tangent
  COT = 'cot', // Cotangent
  CTG = 'ctg', // Cotangent
  ASIN = 'asin', // Arcsine
  ACOS = 'acos', // Arccosine
  ATAN = 'atan', // Arctangent
  ACOT = 'acot', // Arccotangent
  ACTG = 'actg', // Arccotangent
  R2D = 'R2D', // Radians to degrees
  D2R = 'D2R', // Degrees to radians
  SQRT = 'sqrt', // Square root
  SQRTN = 'sqrtn', // Nth root

  // Set functions
  UNION = 'union', // Set union
  INTERSECT = 'intersect', // Set intersection
  DIFFERENCE = 'difference', // Set difference
  DIFF = 'diff', // Alias for difference

  // Statistical functions
  SUM = 'sum', // Sum of all elements
  MIN = 'min', // Minimum value
  MAX = 'max', // Maximum value
  COUNT = 'count', // Number of elements
  MEAN = 'mean', // Mean value
  MEDIAN = 'median', // Median value
  MODE = 'mode', // Mode value
  RANGE = 'range', // Range of values
  VARIANCE = 'variance', // Variance
  VAR = 'var', // Variance
  STDDEV = 'stddev', // Standard deviation
  MAD = 'MAD', // Mean absolute deviation
  RMS = 'RMS', // Root mean square

  // Random functions
  RAND = 'rand', // Random number between 0 and 1
  RANDINT = 'randint', // Random integer between a and b
  RANDN = 'randn', // Random number from the normal distribution
}
