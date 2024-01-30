/**
 * build.js taken from:
 * @link https://marmelab.com/blog/2021/07/22/cra-webpack-no-eject.html
 */
const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');

/**
 * Do not mangle component names in production, for a better learning experience
 * @link https://kentcdodds.com/blog/profile-a-react-app-for-performance#disable-function-name-mangling
 */
config.optimization.minimizer[0].options.minimizer.options.keep_classnames = true;
config.optimization.minimizer[0].options.minimizer.options.keep_fnames = true;
