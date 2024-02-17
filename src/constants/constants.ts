import * as PACKAGE from '~/package.json';
import {camelize, capitalizeFirstLetter, firstLetters} from '@utils/convertString';

const GADGET_DESCRIPTION = PACKAGE.description satisfies string;
const GADGET_NAME = capitalizeFirstLetter(camelize(PACKAGE.name)) satisfies string;
const GADGET_NAME_NOSPACE = capitalizeFirstLetter(camelize(PACKAGE.name, false)) satisfies string;
const GADGET_NAME_ORIGINAL = PACKAGE.name satisfies string;
const GADGET_NAME_SHORT = firstLetters(GADGET_NAME) satisfies string;
const GADGET_VERSION = `v${PACKAGE.version}` satisfies string;

export {GADGET_DESCRIPTION, GADGET_NAME, GADGET_NAME_NOSPACE, GADGET_NAME_ORIGINAL, GADGET_NAME_SHORT, GADGET_VERSION};
