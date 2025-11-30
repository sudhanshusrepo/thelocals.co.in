#!/usr/bin/env node

/**
 * Automated UI Validation Script
 * Checks for common issues in the updated components
 */

const fs = require('fs');
const path = require('path');

const results = {
    passed: [],
    failed: [],
    warnings: []
};

// Check 1: Verify safe-area-inset usage
console.log('🔍 Checking safe-area-inset implementation...');
const clientHeader = fs.readFileSync(
    path.join(__dirname, '../packages/client/components/Header.tsx'),
    'utf8'
);
const providerHeader = fs.readFileSync(
    path.join(__dirname, '../packages/provider/components/Header.tsx'),
    'utf8'
);

if (clientHeader.includes('env(safe-area-inset-top)') &&
    providerHeader.includes('env(safe-area-inset-top)')) {
    results.passed.push('✅ Safe area insets implemented in both headers');
} else {
    results.failed.push('❌ Safe area insets missing in one or both headers');
}

// Check 2: Verify viewport-fit=cover
console.log('🔍 Checking viewport meta tags...');
const clientHtml = fs.readFileSync(
    path.join(__dirname, '../packages/client/index.html'),
    'utf8'
);
const providerHtml = fs.readFileSync(
    path.join(__dirname, '../packages/provider/index.html'),
    'utf8'
);

if (clientHtml.includes('viewport-fit=cover') &&
    providerHtml.includes('viewport-fit=cover')) {
    results.passed.push('✅ Viewport-fit=cover set in both apps');
} else {
    results.failed.push('❌ Viewport-fit=cover missing in one or both apps');
}

// Check 3: Verify shared auth components exist
console.log('🔍 Checking shared auth components...');
const authComponents = [
    'AuthLayout.tsx',
    'AuthField.tsx',
    'AuthButton.tsx',
    'AuthOAuthButton.tsx',
    'AuthDivider.tsx',
    'index.ts'
];

let allComponentsExist = true;
authComponents.forEach(component => {
    const componentPath = path.join(
        __dirname,
        '../packages/core/components/auth',
        component
    );
    if (!fs.existsSync(componentPath)) {
        allComponentsExist = false;
        results.failed.push(`❌ Missing auth component: ${component}`);
    }
});

if (allComponentsExist) {
    results.passed.push('✅ All shared auth components created');
}

// Check 4: Verify auth components are imported
console.log('🔍 Checking auth component imports...');
const clientAuth = fs.readFileSync(
    path.join(__dirname, '../packages/client/components/AuthModal.tsx'),
    'utf8'
);
const providerAuth = fs.readFileSync(
    path.join(__dirname, '../packages/provider/components/AuthModal.tsx'),
    'utf8'
);

if (clientAuth.includes('@core/components/auth') &&
    providerAuth.includes('@core/components/auth')) {
    results.passed.push('✅ Both apps import shared auth components');
} else {
    results.failed.push('❌ One or both apps not using shared auth components');
}

// Check 5: Verify card layout updates
console.log('🔍 Checking card layout optimizations...');
const homePage = fs.readFileSync(
    path.join(__dirname, '../packages/client/components/HomePage.tsx'),
    'utf8'
);
const groupDetailPage = fs.readFileSync(
    path.join(__dirname, '../packages/client/components/GroupDetailPage.tsx'),
    'utf8'
);

if (homePage.includes('px-0') && homePage.includes('gap-1.5 sm:gap-3')) {
    results.passed.push('✅ Homepage card layout optimized');
} else {
    results.warnings.push('⚠️  Homepage card layout may not be fully optimized');
}

if (groupDetailPage.includes('grid-cols-3') &&
    groupDetailPage.includes('gap-1.5 sm:gap-3')) {
    results.passed.push('✅ Group detail page card layout standardized');
} else {
    results.warnings.push('⚠️  Group detail page layout may not match homepage');
}

// Check 6: Verify min-height usage (not fixed height)
console.log('🔍 Checking responsive header heights...');
if (clientHeader.includes('min-h-[') && providerHeader.includes('min-h-[')) {
    results.passed.push('✅ Headers use min-height (responsive)');
} else {
    results.warnings.push('⚠️  Headers may still use fixed heights');
}

// Print results
console.log('\n' + '='.repeat(60));
console.log('📊 VALIDATION RESULTS');
console.log('='.repeat(60) + '\n');

if (results.passed.length > 0) {
    console.log('✅ PASSED CHECKS:\n');
    results.passed.forEach(msg => console.log(`  ${msg}`));
    console.log('');
}

if (results.warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    results.warnings.forEach(msg => console.log(`  ${msg}`));
    console.log('');
}

if (results.failed.length > 0) {
    console.log('❌ FAILED CHECKS:\n');
    results.failed.forEach(msg => console.log(`  ${msg}`));
    console.log('');
}

console.log('='.repeat(60));
console.log(`Summary: ${results.passed.length} passed, ${results.warnings.length} warnings, ${results.failed.length} failed`);
console.log('='.repeat(60) + '\n');

// Exit with error if any checks failed
if (results.failed.length > 0) {
    process.exit(1);
}
