import{e as Dr,N as At,f as wr,d as Ze,F as tr,V as We,R as Ir,g as ft,w as on,h as qt,W as Qn,i as Ht,j as nt,L as Xt,H as hn,U as It,D as Mt,B as mt,k as $t,l as _n,p as Nr,E as yr,m as dt,P as sn,n as Or,o as Sn,q as Tt,r as dn,s as Wn,t as Zt,u as Qt,v as nr,x as Fr,y as Ft,z as un,G as Br,I as Gr,J as zt,O as Hr,K as Vr,Q as kr,X as Wr,Y as zr,Z as Xr,_ as Yr,$ as Kr,a0 as qr,a1 as $r,a2 as Zr,a3 as Qr,a4 as Jr,a5 as jr,a6 as ea,a7 as ta,a8 as na,a9 as ia,aa as Mn,ab as Bt,ac as tn,ad as ra,ae as Kt,af as aa,ag as oa,ah as sa,ai as ca,aj as ir,ak as la,al as fa,am as da,an as ua,ao as Be,ap as pa,aq as ha,ar as _a,as as Nt,at as rr,au as cn,b as xt,av as ar,aw as wt,ax as St,ay as pn,az as or,aA as sr,aB as cr,aC as ma,aD as va,aE as ga,aF as lr,aG as Dt,aH as Ea,aI as Sa,aJ as Ma,aK as fr,aL as Ta,aM as dr,aN as ur,aO as Tn,aP as xn,aQ as An,aR as Rn,aS as qe,aT as Jn,aU as jn,aV as ei,aW as ti,aX as ni,aY as ii,aZ as ri,a_ as ai,a$ as oi,b0 as si,b1 as ci,b2 as li,b3 as fi,b4 as di,b5 as ui,b6 as pi,b7 as hi,b8 as _i,b9 as mi,ba as vi,bb as gi,bc as Cn,bd as Ei,be as Si,bf as xa,bg as Mi,bh as Ti,bi as xi,bj as In,bk as Nn,bl as yn,bm as On,bn as Fn,bo as Bn,bp as Gn,bq as Aa,br as Ai,bs as Ra,bt as ln,bu as Ca,bv as Ri,bw as Ci,bx as bi,by as Hn,bz as Vn,bA as ba,bB as pr,bC as Pa,bD as lt,bE as mn,bF as La,bG as Ua,bH as hr,bI as _r,bJ as Pi,bK as mr,bL as vr,bM as Li,bN as gr,bO as Jt,bP as Vt,bQ as Da,bR as wa,bS as Ia,bT as Na,bU as ya,bV as Ui,bW as Oa,bX as Fa,bY as Ba,bZ as Ga,b_ as Ha,b$ as Va,c0 as ka,c1 as Wa,c2 as za,c3 as Xa,c4 as Ya,c5 as Ka,c6 as qa,c7 as $a,c8 as Za,c9 as Qa,ca as Ja}from"./three.core-STHyFmcR.js";/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Er(){let e=null,n=!1,t=null,i=null;function c(o,h){t(o,h),i=e.requestAnimationFrame(c)}return{start:function(){n!==!0&&t!==null&&(i=e.requestAnimationFrame(c),n=!0)},stop:function(){e.cancelAnimationFrame(i),n=!1},setAnimationLoop:function(o){t=o},setContext:function(o){e=o}}}function ja(e){const n=new WeakMap;function t(f,b){const x=f.array,U=f.usage,E=x.byteLength,M=e.createBuffer();e.bindBuffer(b,M),e.bufferData(b,x,U),f.onUploadCallback();let R;if(x instanceof Float32Array)R=e.FLOAT;else if(typeof Float16Array<"u"&&x instanceof Float16Array)R=e.HALF_FLOAT;else if(x instanceof Uint16Array)f.isFloat16BufferAttribute?R=e.HALF_FLOAT:R=e.UNSIGNED_SHORT;else if(x instanceof Int16Array)R=e.SHORT;else if(x instanceof Uint32Array)R=e.UNSIGNED_INT;else if(x instanceof Int32Array)R=e.INT;else if(x instanceof Int8Array)R=e.BYTE;else if(x instanceof Uint8Array)R=e.UNSIGNED_BYTE;else if(x instanceof Uint8ClampedArray)R=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+x);return{buffer:M,type:R,bytesPerElement:x.BYTES_PER_ELEMENT,version:f.version,size:E}}function i(f,b,x){const U=b.array,E=b.updateRanges;if(e.bindBuffer(x,f),E.length===0)e.bufferSubData(x,0,U);else{E.sort((R,F)=>R.start-F.start);let M=0;for(let R=1;R<E.length;R++){const F=E[M],L=E[R];L.start<=F.start+F.count+1?F.count=Math.max(F.count,L.start+L.count-F.start):(++M,E[M]=L)}E.length=M+1;for(let R=0,F=E.length;R<F;R++){const L=E[R];e.bufferSubData(x,L.start*U.BYTES_PER_ELEMENT,U,L.start,L.count)}b.clearUpdateRanges()}b.onUploadCallback()}function c(f){return f.isInterleavedBufferAttribute&&(f=f.data),n.get(f)}function o(f){f.isInterleavedBufferAttribute&&(f=f.data);const b=n.get(f);b&&(e.deleteBuffer(b.buffer),n.delete(f))}function h(f,b){if(f.isInterleavedBufferAttribute&&(f=f.data),f.isGLBufferAttribute){const U=n.get(f);(!U||U.version<f.version)&&n.set(f,{buffer:f.buffer,type:f.type,bytesPerElement:f.elementSize,version:f.version});return}const x=n.get(f);if(x===void 0)n.set(f,t(f,b));else if(x.version<f.version){if(x.size!==f.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(x.buffer,f,b),x.version=f.version}}return{get:c,remove:o,update:h}}var eo=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,to=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,no=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,io=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ro=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ao=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,oo=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,so=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,co=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,lo=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,fo=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,uo=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,po=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ho=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,_o=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,mo=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,vo=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,go=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Eo=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,So=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Mo=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,To=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,xo=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Ao=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Ro=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Co=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,bo=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Po=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Lo=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Uo=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Do="gl_FragColor = linearToOutputTexel( gl_FragColor );",wo=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Io=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,No=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,yo=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Oo=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Fo=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Bo=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Go=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ho=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Vo=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ko=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Wo=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,zo=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Xo=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Yo=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ko=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,qo=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,$o=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Zo=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Qo=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Jo=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,jo=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,es=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ts=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ns=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,is=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,rs=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,as=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,os=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ss=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,cs=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ls=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,fs=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ds=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,us=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ps=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,hs=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,_s=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ms=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,vs=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gs=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Es=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ss=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ms=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ts=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,xs=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,As=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Rs=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Cs=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,bs=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ps=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ls=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Us=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ds=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ws=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Is=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ns=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ys=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Os=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSEDEPTHBUF
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSEDEPTHBUF
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare , distribution.x );
		#endif
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Fs=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Bs=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Gs=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Hs=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Vs=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,ks=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ws=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,zs=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Xs=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ys=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ks=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,qs=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,$s=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Zs=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Qs=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Js=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,js=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ec=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,tc=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nc=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ic=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rc=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ac=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,oc=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,sc=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSEDEPTHBUF
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,cc=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,lc=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,fc=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,dc=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,uc=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,pc=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,hc=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,_c=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mc=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vc=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gc=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Ec=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sc=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Mc=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Tc=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xc=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ac=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Rc=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cc=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,bc=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pc=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Lc=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Uc=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Dc=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,wc=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ic=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,De={alphahash_fragment:eo,alphahash_pars_fragment:to,alphamap_fragment:no,alphamap_pars_fragment:io,alphatest_fragment:ro,alphatest_pars_fragment:ao,aomap_fragment:oo,aomap_pars_fragment:so,batching_pars_vertex:co,batching_vertex:lo,begin_vertex:fo,beginnormal_vertex:uo,bsdfs:po,iridescence_fragment:ho,bumpmap_pars_fragment:_o,clipping_planes_fragment:mo,clipping_planes_pars_fragment:vo,clipping_planes_pars_vertex:go,clipping_planes_vertex:Eo,color_fragment:So,color_pars_fragment:Mo,color_pars_vertex:To,color_vertex:xo,common:Ao,cube_uv_reflection_fragment:Ro,defaultnormal_vertex:Co,displacementmap_pars_vertex:bo,displacementmap_vertex:Po,emissivemap_fragment:Lo,emissivemap_pars_fragment:Uo,colorspace_fragment:Do,colorspace_pars_fragment:wo,envmap_fragment:Io,envmap_common_pars_fragment:No,envmap_pars_fragment:yo,envmap_pars_vertex:Oo,envmap_physical_pars_fragment:Ko,envmap_vertex:Fo,fog_vertex:Bo,fog_pars_vertex:Go,fog_fragment:Ho,fog_pars_fragment:Vo,gradientmap_pars_fragment:ko,lightmap_pars_fragment:Wo,lights_lambert_fragment:zo,lights_lambert_pars_fragment:Xo,lights_pars_begin:Yo,lights_toon_fragment:qo,lights_toon_pars_fragment:$o,lights_phong_fragment:Zo,lights_phong_pars_fragment:Qo,lights_physical_fragment:Jo,lights_physical_pars_fragment:jo,lights_fragment_begin:es,lights_fragment_maps:ts,lights_fragment_end:ns,logdepthbuf_fragment:is,logdepthbuf_pars_fragment:rs,logdepthbuf_pars_vertex:as,logdepthbuf_vertex:os,map_fragment:ss,map_pars_fragment:cs,map_particle_fragment:ls,map_particle_pars_fragment:fs,metalnessmap_fragment:ds,metalnessmap_pars_fragment:us,morphinstance_vertex:ps,morphcolor_vertex:hs,morphnormal_vertex:_s,morphtarget_pars_vertex:ms,morphtarget_vertex:vs,normal_fragment_begin:gs,normal_fragment_maps:Es,normal_pars_fragment:Ss,normal_pars_vertex:Ms,normal_vertex:Ts,normalmap_pars_fragment:xs,clearcoat_normal_fragment_begin:As,clearcoat_normal_fragment_maps:Rs,clearcoat_pars_fragment:Cs,iridescence_pars_fragment:bs,opaque_fragment:Ps,packing:Ls,premultiplied_alpha_fragment:Us,project_vertex:Ds,dithering_fragment:ws,dithering_pars_fragment:Is,roughnessmap_fragment:Ns,roughnessmap_pars_fragment:ys,shadowmap_pars_fragment:Os,shadowmap_pars_vertex:Fs,shadowmap_vertex:Bs,shadowmask_pars_fragment:Gs,skinbase_vertex:Hs,skinning_pars_vertex:Vs,skinning_vertex:ks,skinnormal_vertex:Ws,specularmap_fragment:zs,specularmap_pars_fragment:Xs,tonemapping_fragment:Ys,tonemapping_pars_fragment:Ks,transmission_fragment:qs,transmission_pars_fragment:$s,uv_pars_fragment:Zs,uv_pars_vertex:Qs,uv_vertex:Js,worldpos_vertex:js,background_vert:ec,background_frag:tc,backgroundCube_vert:nc,backgroundCube_frag:ic,cube_vert:rc,cube_frag:ac,depth_vert:oc,depth_frag:sc,distanceRGBA_vert:cc,distanceRGBA_frag:lc,equirect_vert:fc,equirect_frag:dc,linedashed_vert:uc,linedashed_frag:pc,meshbasic_vert:hc,meshbasic_frag:_c,meshlambert_vert:mc,meshlambert_frag:vc,meshmatcap_vert:gc,meshmatcap_frag:Ec,meshnormal_vert:Sc,meshnormal_frag:Mc,meshphong_vert:Tc,meshphong_frag:xc,meshphysical_vert:Ac,meshphysical_frag:Rc,meshtoon_vert:Cc,meshtoon_frag:bc,points_vert:Pc,points_frag:Lc,shadow_vert:Uc,shadow_frag:Dc,sprite_vert:wc,sprite_frag:Ic},ie={common:{diffuse:{value:new Ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Be}},envmap:{envMap:{value:null},envMapRotation:{value:new Be},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Be}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Be}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Be},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Be},normalScale:{value:new dt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Be},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Be}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Be}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Be}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0},uvTransform:{value:new Be}},sprite:{diffuse:{value:new Ze(16777215)},opacity:{value:1},center:{value:new dt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}}},gt={basic:{uniforms:lt([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.fog]),vertexShader:De.meshbasic_vert,fragmentShader:De.meshbasic_frag},lambert:{uniforms:lt([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,ie.lights,{emissive:{value:new Ze(0)}}]),vertexShader:De.meshlambert_vert,fragmentShader:De.meshlambert_frag},phong:{uniforms:lt([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,ie.lights,{emissive:{value:new Ze(0)},specular:{value:new Ze(1118481)},shininess:{value:30}}]),vertexShader:De.meshphong_vert,fragmentShader:De.meshphong_frag},standard:{uniforms:lt([ie.common,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.roughnessmap,ie.metalnessmap,ie.fog,ie.lights,{emissive:{value:new Ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:De.meshphysical_vert,fragmentShader:De.meshphysical_frag},toon:{uniforms:lt([ie.common,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.gradientmap,ie.fog,ie.lights,{emissive:{value:new Ze(0)}}]),vertexShader:De.meshtoon_vert,fragmentShader:De.meshtoon_frag},matcap:{uniforms:lt([ie.common,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,{matcap:{value:null}}]),vertexShader:De.meshmatcap_vert,fragmentShader:De.meshmatcap_frag},points:{uniforms:lt([ie.points,ie.fog]),vertexShader:De.points_vert,fragmentShader:De.points_frag},dashed:{uniforms:lt([ie.common,ie.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:De.linedashed_vert,fragmentShader:De.linedashed_frag},depth:{uniforms:lt([ie.common,ie.displacementmap]),vertexShader:De.depth_vert,fragmentShader:De.depth_frag},normal:{uniforms:lt([ie.common,ie.bumpmap,ie.normalmap,ie.displacementmap,{opacity:{value:1}}]),vertexShader:De.meshnormal_vert,fragmentShader:De.meshnormal_frag},sprite:{uniforms:lt([ie.sprite,ie.fog]),vertexShader:De.sprite_vert,fragmentShader:De.sprite_frag},background:{uniforms:{uvTransform:{value:new Be},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:De.background_vert,fragmentShader:De.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Be}},vertexShader:De.backgroundCube_vert,fragmentShader:De.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:De.cube_vert,fragmentShader:De.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:De.equirect_vert,fragmentShader:De.equirect_frag},distanceRGBA:{uniforms:lt([ie.common,ie.displacementmap,{referencePosition:{value:new We},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:De.distanceRGBA_vert,fragmentShader:De.distanceRGBA_frag},shadow:{uniforms:lt([ie.lights,ie.fog,{color:{value:new Ze(0)},opacity:{value:1}}]),vertexShader:De.shadow_vert,fragmentShader:De.shadow_frag}};gt.physical={uniforms:lt([gt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Be},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Be},clearcoatNormalScale:{value:new dt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Be},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Be},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Be},sheen:{value:0},sheenColor:{value:new Ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Be},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Be},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Be},transmissionSamplerSize:{value:new dt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Be},attenuationDistance:{value:0},attenuationColor:{value:new Ze(0)},specularColor:{value:new Ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Be},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Be},anisotropyVector:{value:new dt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Be}}]),vertexShader:De.meshphysical_vert,fragmentShader:De.meshphysical_frag};const nn={r:0,b:0,g:0},bt=new mr,Nc=new qt;function yc(e,n,t,i,c,o,h){const f=new Ze(0);let b=o===!0?0:1,x,U,E=null,M=0,R=null;function F(A){let m=A.isScene===!0?A.background:null;return m&&m.isTexture&&(m=(A.backgroundBlurriness>0?t:n).get(m)),m}function L(A){let m=!1;const y=F(A);y===null?r(f,b):y&&y.isColor&&(r(y,1),m=!0);const P=e.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,h):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,h),(e.autoClear||m)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function l(A,m){const y=F(m);y&&(y.isCubeTexture||y.mapping===mn)?(U===void 0&&(U=new xt(new _r(1,1,1),new Nt({name:"BackgroundCubeMaterial",uniforms:Pi(gt.backgroundCube.uniforms),vertexShader:gt.backgroundCube.vertexShader,fragmentShader:gt.backgroundCube.fragmentShader,side:mt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),U.geometry.deleteAttribute("normal"),U.geometry.deleteAttribute("uv"),U.onBeforeRender=function(P,N,V){this.matrixWorld.copyPosition(V.matrixWorld)},Object.defineProperty(U.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),c.update(U)),bt.copy(m.backgroundRotation),bt.x*=-1,bt.y*=-1,bt.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(bt.y*=-1,bt.z*=-1),U.material.uniforms.envMap.value=y,U.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,U.material.uniforms.backgroundBlurriness.value=m.backgroundBlurriness,U.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,U.material.uniforms.backgroundRotation.value.setFromMatrix4(Nc.makeRotationFromEuler(bt)),U.material.toneMapped=nt.getTransfer(y.colorSpace)!==qe,(E!==y||M!==y.version||R!==e.toneMapping)&&(U.material.needsUpdate=!0,E=y,M=y.version,R=e.toneMapping),U.layers.enableAll(),A.unshift(U,U.geometry,U.material,0,0,null)):y&&y.isTexture&&(x===void 0&&(x=new xt(new cr(2,2),new Nt({name:"BackgroundMaterial",uniforms:Pi(gt.background.uniforms),vertexShader:gt.background.vertexShader,fragmentShader:gt.background.fragmentShader,side:$t,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),x.geometry.deleteAttribute("normal"),Object.defineProperty(x.material,"map",{get:function(){return this.uniforms.t2D.value}}),c.update(x)),x.material.uniforms.t2D.value=y,x.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,x.material.toneMapped=nt.getTransfer(y.colorSpace)!==qe,y.matrixAutoUpdate===!0&&y.updateMatrix(),x.material.uniforms.uvTransform.value.copy(y.matrix),(E!==y||M!==y.version||R!==e.toneMapping)&&(x.material.needsUpdate=!0,E=y,M=y.version,R=e.toneMapping),x.layers.enableAll(),A.unshift(x,x.geometry,x.material,0,0,null))}function r(A,m){A.getRGB(nn,hr(e)),i.buffers.color.setClear(nn.r,nn.g,nn.b,m,h)}function I(){U!==void 0&&(U.geometry.dispose(),U.material.dispose(),U=void 0),x!==void 0&&(x.geometry.dispose(),x.material.dispose(),x=void 0)}return{getClearColor:function(){return f},setClearColor:function(A,m=1){f.set(A),b=m,r(f,b)},getClearAlpha:function(){return b},setClearAlpha:function(A){b=A,r(f,b)},render:L,addToRenderList:l,dispose:I}}function Oc(e,n){const t=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},c=M(null);let o=c,h=!1;function f(d,g,Y,X,k){let J=!1;const z=E(X,Y,g);o!==z&&(o=z,x(o.object)),J=R(d,X,Y,k),J&&F(d,X,Y,k),k!==null&&n.update(k,e.ELEMENT_ARRAY_BUFFER),(J||h)&&(h=!1,m(d,g,Y,X),k!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.get(k).buffer))}function b(){return e.createVertexArray()}function x(d){return e.bindVertexArray(d)}function U(d){return e.deleteVertexArray(d)}function E(d,g,Y){const X=Y.wireframe===!0;let k=i[d.id];k===void 0&&(k={},i[d.id]=k);let J=k[g.id];J===void 0&&(J={},k[g.id]=J);let z=J[X];return z===void 0&&(z=M(b()),J[X]=z),z}function M(d){const g=[],Y=[],X=[];for(let k=0;k<t;k++)g[k]=0,Y[k]=0,X[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:g,enabledAttributes:Y,attributeDivisors:X,object:d,attributes:{},index:null}}function R(d,g,Y,X){const k=o.attributes,J=g.attributes;let z=0;const ne=Y.getAttributes();for(const G in ne)if(ne[G].location>=0){const Te=k[G];let we=J[G];if(we===void 0&&(G==="instanceMatrix"&&d.instanceMatrix&&(we=d.instanceMatrix),G==="instanceColor"&&d.instanceColor&&(we=d.instanceColor)),Te===void 0||Te.attribute!==we||we&&Te.data!==we.data)return!0;z++}return o.attributesNum!==z||o.index!==X}function F(d,g,Y,X){const k={},J=g.attributes;let z=0;const ne=Y.getAttributes();for(const G in ne)if(ne[G].location>=0){let Te=J[G];Te===void 0&&(G==="instanceMatrix"&&d.instanceMatrix&&(Te=d.instanceMatrix),G==="instanceColor"&&d.instanceColor&&(Te=d.instanceColor));const we={};we.attribute=Te,Te&&Te.data&&(we.data=Te.data),k[G]=we,z++}o.attributes=k,o.attributesNum=z,o.index=X}function L(){const d=o.newAttributes;for(let g=0,Y=d.length;g<Y;g++)d[g]=0}function l(d){r(d,0)}function r(d,g){const Y=o.newAttributes,X=o.enabledAttributes,k=o.attributeDivisors;Y[d]=1,X[d]===0&&(e.enableVertexAttribArray(d),X[d]=1),k[d]!==g&&(e.vertexAttribDivisor(d,g),k[d]=g)}function I(){const d=o.newAttributes,g=o.enabledAttributes;for(let Y=0,X=g.length;Y<X;Y++)g[Y]!==d[Y]&&(e.disableVertexAttribArray(Y),g[Y]=0)}function A(d,g,Y,X,k,J,z){z===!0?e.vertexAttribIPointer(d,g,Y,k,J):e.vertexAttribPointer(d,g,Y,X,k,J)}function m(d,g,Y,X){L();const k=X.attributes,J=Y.getAttributes(),z=g.defaultAttributeValues;for(const ne in J){const G=J[ne];if(G.location>=0){let ve=k[ne];if(ve===void 0&&(ne==="instanceMatrix"&&d.instanceMatrix&&(ve=d.instanceMatrix),ne==="instanceColor"&&d.instanceColor&&(ve=d.instanceColor)),ve!==void 0){const Te=ve.normalized,we=ve.itemSize,Oe=n.get(ve);if(Oe===void 0)continue;const it=Oe.buffer,Ye=Oe.type,H=Oe.bytesPerElement,re=Ye===e.INT||Ye===e.UNSIGNED_INT||ve.gpuType===lr;if(ve.isInterleavedBufferAttribute){const ee=ve.data,xe=ee.stride,Ae=ve.offset;if(ee.isInstancedInterleavedBuffer){for(let Pe=0;Pe<G.locationSize;Pe++)r(G.location+Pe,ee.meshPerAttribute);d.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let Pe=0;Pe<G.locationSize;Pe++)l(G.location+Pe);e.bindBuffer(e.ARRAY_BUFFER,it);for(let Pe=0;Pe<G.locationSize;Pe++)A(G.location+Pe,we/G.locationSize,Ye,Te,xe*H,(Ae+we/G.locationSize*Pe)*H,re)}else{if(ve.isInstancedBufferAttribute){for(let ee=0;ee<G.locationSize;ee++)r(G.location+ee,ve.meshPerAttribute);d.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=ve.meshPerAttribute*ve.count)}else for(let ee=0;ee<G.locationSize;ee++)l(G.location+ee);e.bindBuffer(e.ARRAY_BUFFER,it);for(let ee=0;ee<G.locationSize;ee++)A(G.location+ee,we/G.locationSize,Ye,Te,we*H,we/G.locationSize*ee*H,re)}}else if(z!==void 0){const Te=z[ne];if(Te!==void 0)switch(Te.length){case 2:e.vertexAttrib2fv(G.location,Te);break;case 3:e.vertexAttrib3fv(G.location,Te);break;case 4:e.vertexAttrib4fv(G.location,Te);break;default:e.vertexAttrib1fv(G.location,Te)}}}}I()}function y(){V();for(const d in i){const g=i[d];for(const Y in g){const X=g[Y];for(const k in X)U(X[k].object),delete X[k];delete g[Y]}delete i[d]}}function P(d){if(i[d.id]===void 0)return;const g=i[d.id];for(const Y in g){const X=g[Y];for(const k in X)U(X[k].object),delete X[k];delete g[Y]}delete i[d.id]}function N(d){for(const g in i){const Y=i[g];if(Y[d.id]===void 0)continue;const X=Y[d.id];for(const k in X)U(X[k].object),delete X[k];delete Y[d.id]}}function V(){p(),h=!0,o!==c&&(o=c,x(o.object))}function p(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:f,reset:V,resetDefaultState:p,dispose:y,releaseStatesOfGeometry:P,releaseStatesOfProgram:N,initAttributes:L,enableAttribute:l,disableUnusedAttributes:I}}function Fc(e,n,t){let i;function c(x){i=x}function o(x,U){e.drawArrays(i,x,U),t.update(U,i,1)}function h(x,U,E){E!==0&&(e.drawArraysInstanced(i,x,U,E),t.update(U,i,E))}function f(x,U,E){if(E===0)return;n.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,x,0,U,0,E);let R=0;for(let F=0;F<E;F++)R+=U[F];t.update(R,i,1)}function b(x,U,E,M){if(E===0)return;const R=n.get("WEBGL_multi_draw");if(R===null)for(let F=0;F<x.length;F++)h(x[F],U[F],M[F]);else{R.multiDrawArraysInstancedWEBGL(i,x,0,U,0,M,0,E);let F=0;for(let L=0;L<E;L++)F+=U[L]*M[L];t.update(F,i,1)}}this.setMode=c,this.render=o,this.renderInstances=h,this.renderMultiDraw=f,this.renderMultiDrawInstances=b}function Bc(e,n,t,i){let c;function o(){if(c!==void 0)return c;if(n.has("EXT_texture_filter_anisotropic")===!0){const N=n.get("EXT_texture_filter_anisotropic");c=e.getParameter(N.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else c=0;return c}function h(N){return!(N!==Tt&&i.convert(N)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function f(N){const V=N===hn&&(n.has("EXT_color_buffer_half_float")||n.has("EXT_color_buffer_float"));return!(N!==It&&i.convert(N)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&N!==Dt&&!V)}function b(N){if(N==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";N="mediump"}return N==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let x=t.precision!==void 0?t.precision:"highp";const U=b(x);U!==x&&(console.warn("THREE.WebGLRenderer:",x,"not supported, using",U,"instead."),x=U);const E=t.logarithmicDepthBuffer===!0,M=t.reversedDepthBuffer===!0&&n.has("EXT_clip_control"),R=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),F=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),L=e.getParameter(e.MAX_TEXTURE_SIZE),l=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),r=e.getParameter(e.MAX_VERTEX_ATTRIBS),I=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),A=e.getParameter(e.MAX_VARYING_VECTORS),m=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),y=F>0,P=e.getParameter(e.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:b,textureFormatReadable:h,textureTypeReadable:f,precision:x,logarithmicDepthBuffer:E,reversedDepthBuffer:M,maxTextures:R,maxVertexTextures:F,maxTextureSize:L,maxCubemapSize:l,maxAttributes:r,maxVertexUniforms:I,maxVaryings:A,maxFragmentUniforms:m,vertexTextures:y,maxSamples:P}}function Gc(e){const n=this;let t=null,i=0,c=!1,o=!1;const h=new ua,f=new Be,b={value:null,needsUpdate:!1};this.uniform=b,this.numPlanes=0,this.numIntersection=0,this.init=function(E,M){const R=E.length!==0||M||i!==0||c;return c=M,i=E.length,R},this.beginShadows=function(){o=!0,U(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(E,M){t=U(E,M,0)},this.setState=function(E,M,R){const F=E.clippingPlanes,L=E.clipIntersection,l=E.clipShadows,r=e.get(E);if(!c||F===null||F.length===0||o&&!l)o?U(null):x();else{const I=o?0:i,A=I*4;let m=r.clippingState||null;b.value=m,m=U(F,M,A,R);for(let y=0;y!==A;++y)m[y]=t[y];r.clippingState=m,this.numIntersection=L?this.numPlanes:0,this.numPlanes+=I}};function x(){b.value!==t&&(b.value=t,b.needsUpdate=i>0),n.numPlanes=i,n.numIntersection=0}function U(E,M,R,F){const L=E!==null?E.length:0;let l=null;if(L!==0){if(l=b.value,F!==!0||l===null){const r=R+L*4,I=M.matrixWorldInverse;f.getNormalMatrix(I),(l===null||l.length<r)&&(l=new Float32Array(r));for(let A=0,m=R;A!==L;++A,m+=4)h.copy(E[A]).applyMatrix4(I,f),h.normal.toArray(l,m),l[m+3]=h.constant}b.value=l,b.needsUpdate=!0}return n.numPlanes=L,n.numIntersection=0,l}}function Hc(e){let n=new WeakMap;function t(h,f){return f===Hn?h.mapping=Jt:f===Vn&&(h.mapping=Vt),h}function i(h){if(h&&h.isTexture){const f=h.mapping;if(f===Hn||f===Vn)if(n.has(h)){const b=n.get(h).texture;return t(b,h.mapping)}else{const b=h.image;if(b&&b.height>0){const x=new ba(b.height);return x.fromEquirectangularTexture(e,h),n.set(h,x),h.addEventListener("dispose",c),t(x.texture,h.mapping)}else return null}}return h}function c(h){const f=h.target;f.removeEventListener("dispose",c);const b=n.get(f);b!==void 0&&(n.delete(f),b.dispose())}function o(){n=new WeakMap}return{get:i,dispose:o}}const Gt=4,Di=[.125,.215,.35,.446,.526,.582],Ut=20,bn=new Da,wi=new Ze;let Pn=null,Ln=0,Un=0,Dn=!1;const Lt=(1+Math.sqrt(5))/2,Ot=1/Lt,Ii=[new We(-Lt,Ot,0),new We(Lt,Ot,0),new We(-Ot,0,Lt),new We(Ot,0,Lt),new We(0,Lt,-Ot),new We(0,Lt,Ot),new We(-1,1,-1),new We(1,1,-1),new We(-1,1,1),new We(1,1,1)],Vc=new We;class Ni{constructor(n){this._renderer=n,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(n,t=0,i=.1,c=100,o={}){const{size:h=256,position:f=Vc}=o;Pn=this._renderer.getRenderTarget(),Ln=this._renderer.getActiveCubeFace(),Un=this._renderer.getActiveMipmapLevel(),Dn=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(h);const b=this._allocateTargets();return b.depthBuffer=!0,this._sceneToCubeUV(n,i,c,b,f),t>0&&this._blur(b,0,0,t),this._applyPMREM(b),this._cleanup(b),b}fromEquirectangular(n,t=null){return this._fromTexture(n,t)}fromCubemap(n,t=null){return this._fromTexture(n,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Fi(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Oi(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(n){this._lodMax=Math.floor(Math.log2(n)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let n=0;n<this._lodPlanes.length;n++)this._lodPlanes[n].dispose()}_cleanup(n){this._renderer.setRenderTarget(Pn,Ln,Un),this._renderer.xr.enabled=Dn,n.scissorTest=!1,rn(n,0,0,n.width,n.height)}_fromTexture(n,t){n.mapping===Jt||n.mapping===Vt?this._setSize(n.image.length===0?16:n.image[0].width||n.image[0].image.width):this._setSize(n.image.width/4),Pn=this._renderer.getRenderTarget(),Ln=this._renderer.getActiveCubeFace(),Un=this._renderer.getActiveMipmapLevel(),Dn=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(n,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const n=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Bt,minFilter:Bt,generateMipmaps:!1,type:hn,format:Tt,colorSpace:_n,depthBuffer:!1},c=yi(n,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==n||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=yi(n,t,i);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=kc(o)),this._blurMaterial=Wc(o,n,t)}return c}_compileMaterial(n){const t=new xt(this._lodPlanes[0],n);this._renderer.compile(t,bn)}_sceneToCubeUV(n,t,i,c,o){const b=new sn(90,1,t,i),x=[1,-1,1,1,1,1],U=[1,1,1,-1,-1,-1],E=this._renderer,M=E.autoClear,R=E.toneMapping;E.getClearColor(wi),E.toneMapping=At,E.autoClear=!1,E.state.buffers.depth.getReversed()&&(E.setRenderTarget(c),E.clearDepth(),E.setRenderTarget(null));const L=new wa({name:"PMREM.Background",side:mt,depthWrite:!1,depthTest:!1}),l=new xt(new _r,L);let r=!1;const I=n.background;I?I.isColor&&(L.color.copy(I),n.background=null,r=!0):(L.color.copy(wi),r=!0);for(let A=0;A<6;A++){const m=A%3;m===0?(b.up.set(0,x[A],0),b.position.set(o.x,o.y,o.z),b.lookAt(o.x+U[A],o.y,o.z)):m===1?(b.up.set(0,0,x[A]),b.position.set(o.x,o.y,o.z),b.lookAt(o.x,o.y+U[A],o.z)):(b.up.set(0,x[A],0),b.position.set(o.x,o.y,o.z),b.lookAt(o.x,o.y,o.z+U[A]));const y=this._cubeSize;rn(c,m*y,A>2?y:0,y,y),E.setRenderTarget(c),r&&E.render(l,b),E.render(n,b)}l.geometry.dispose(),l.material.dispose(),E.toneMapping=R,E.autoClear=M,n.background=I}_textureToCubeUV(n,t){const i=this._renderer,c=n.mapping===Jt||n.mapping===Vt;c?(this._cubemapMaterial===null&&(this._cubemapMaterial=Fi()),this._cubemapMaterial.uniforms.flipEnvMap.value=n.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Oi());const o=c?this._cubemapMaterial:this._equirectMaterial,h=new xt(this._lodPlanes[0],o),f=o.uniforms;f.envMap.value=n;const b=this._cubeSize;rn(t,0,0,3*b,2*b),i.setRenderTarget(t),i.render(h,bn)}_applyPMREM(n){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const c=this._lodPlanes.length;for(let o=1;o<c;o++){const h=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),f=Ii[(c-o-1)%Ii.length];this._blur(n,o-1,o,h,f)}t.autoClear=i}_blur(n,t,i,c,o){const h=this._pingPongRenderTarget;this._halfBlur(n,h,t,i,c,"latitudinal",o),this._halfBlur(h,n,i,i,c,"longitudinal",o)}_halfBlur(n,t,i,c,o,h,f){const b=this._renderer,x=this._blurMaterial;h!=="latitudinal"&&h!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const U=3,E=new xt(this._lodPlanes[c],x),M=x.uniforms,R=this._sizeLods[i]-1,F=isFinite(o)?Math.PI/(2*R):2*Math.PI/(2*Ut-1),L=o/F,l=isFinite(o)?1+Math.floor(U*L):Ut;l>Ut&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${l} samples when the maximum is set to ${Ut}`);const r=[];let I=0;for(let N=0;N<Ut;++N){const V=N/L,p=Math.exp(-V*V/2);r.push(p),N===0?I+=p:N<l&&(I+=2*p)}for(let N=0;N<r.length;N++)r[N]=r[N]/I;M.envMap.value=n.texture,M.samples.value=l,M.weights.value=r,M.latitudinal.value=h==="latitudinal",f&&(M.poleAxis.value=f);const{_lodMax:A}=this;M.dTheta.value=F,M.mipInt.value=A-i;const m=this._sizeLods[c],y=3*m*(c>A-Gt?c-A+Gt:0),P=4*(this._cubeSize-m);rn(t,y,P,3*m,2*m),b.setRenderTarget(t),b.render(E,bn)}}function kc(e){const n=[],t=[],i=[];let c=e;const o=e-Gt+1+Di.length;for(let h=0;h<o;h++){const f=Math.pow(2,c);t.push(f);let b=1/f;h>e-Gt?b=Di[h-e+Gt-1]:h===0&&(b=0),i.push(b);const x=1/(f-2),U=-x,E=1+x,M=[U,U,E,U,E,E,U,U,E,E,U,E],R=6,F=6,L=3,l=2,r=1,I=new Float32Array(L*F*R),A=new Float32Array(l*F*R),m=new Float32Array(r*F*R);for(let P=0;P<R;P++){const N=P%3*2/3-1,V=P>2?0:-1,p=[N,V,0,N+2/3,V,0,N+2/3,V+1,0,N,V,0,N+2/3,V+1,0,N,V+1,0];I.set(p,L*F*P),A.set(M,l*F*P);const d=[P,P,P,P,P,P];m.set(d,r*F*P)}const y=new rr;y.setAttribute("position",new cn(I,L)),y.setAttribute("uv",new cn(A,l)),y.setAttribute("faceIndex",new cn(m,r)),n.push(y),c>Gt&&c--}return{lodPlanes:n,sizeLods:t,sigmas:i}}function yi(e,n,t){const i=new Ht(e,n,t);return i.texture.mapping=mn,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function rn(e,n,t,i,c){e.viewport.set(n,t,i,c),e.scissor.set(n,t,i,c)}function Wc(e,n,t){const i=new Float32Array(Ut),c=new We(0,1,0);return new Nt({name:"SphericalGaussianBlur",defines:{n:Ut,CUBEUV_TEXEL_WIDTH:1/n,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:c}},vertexShader:zn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:wt,depthTest:!1,depthWrite:!1})}function Oi(){return new Nt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:zn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:wt,depthTest:!1,depthWrite:!1})}function Fi(){return new Nt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:zn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:wt,depthTest:!1,depthWrite:!1})}function zn(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function zc(e){let n=new WeakMap,t=null;function i(f){if(f&&f.isTexture){const b=f.mapping,x=b===Hn||b===Vn,U=b===Jt||b===Vt;if(x||U){let E=n.get(f);const M=E!==void 0?E.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==M)return t===null&&(t=new Ni(e)),E=x?t.fromEquirectangular(f,E):t.fromCubemap(f,E),E.texture.pmremVersion=f.pmremVersion,n.set(f,E),E.texture;if(E!==void 0)return E.texture;{const R=f.image;return x&&R&&R.height>0||U&&R&&c(R)?(t===null&&(t=new Ni(e)),E=x?t.fromEquirectangular(f):t.fromCubemap(f),E.texture.pmremVersion=f.pmremVersion,n.set(f,E),f.addEventListener("dispose",o),E.texture):null}}}return f}function c(f){let b=0;const x=6;for(let U=0;U<x;U++)f[U]!==void 0&&b++;return b===x}function o(f){const b=f.target;b.removeEventListener("dispose",o);const x=n.get(b);x!==void 0&&(n.delete(b),x.dispose())}function h(){n=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:h}}function Xc(e){const n={};function t(i){if(n[i]!==void 0)return n[i];let c;switch(i){case"WEBGL_depth_texture":c=e.getExtension("WEBGL_depth_texture")||e.getExtension("MOZ_WEBGL_depth_texture")||e.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":c=e.getExtension("EXT_texture_filter_anisotropic")||e.getExtension("MOZ_EXT_texture_filter_anisotropic")||e.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":c=e.getExtension("WEBGL_compressed_texture_s3tc")||e.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":c=e.getExtension("WEBGL_compressed_texture_pvrtc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:c=e.getExtension(i)}return n[i]=c,c}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const c=t(i);return c===null&&on("THREE.WebGLRenderer: "+i+" extension not supported."),c}}}function Yc(e,n,t,i){const c={},o=new WeakMap;function h(E){const M=E.target;M.index!==null&&n.remove(M.index);for(const F in M.attributes)n.remove(M.attributes[F]);M.removeEventListener("dispose",h),delete c[M.id];const R=o.get(M);R&&(n.remove(R),o.delete(M)),i.releaseStatesOfGeometry(M),M.isInstancedBufferGeometry===!0&&delete M._maxInstanceCount,t.memory.geometries--}function f(E,M){return c[M.id]===!0||(M.addEventListener("dispose",h),c[M.id]=!0,t.memory.geometries++),M}function b(E){const M=E.attributes;for(const R in M)n.update(M[R],e.ARRAY_BUFFER)}function x(E){const M=[],R=E.index,F=E.attributes.position;let L=0;if(R!==null){const I=R.array;L=R.version;for(let A=0,m=I.length;A<m;A+=3){const y=I[A+0],P=I[A+1],N=I[A+2];M.push(y,P,P,N,N,y)}}else if(F!==void 0){const I=F.array;L=F.version;for(let A=0,m=I.length/3-1;A<m;A+=3){const y=A+0,P=A+1,N=A+2;M.push(y,P,P,N,N,y)}}else return;const l=new(ya(M)?Ia:Na)(M,1);l.version=L;const r=o.get(E);r&&n.remove(r),o.set(E,l)}function U(E){const M=o.get(E);if(M){const R=E.index;R!==null&&M.version<R.version&&x(E)}else x(E);return o.get(E)}return{get:f,update:b,getWireframeAttribute:U}}function Kc(e,n,t){let i;function c(M){i=M}let o,h;function f(M){o=M.type,h=M.bytesPerElement}function b(M,R){e.drawElements(i,R,o,M*h),t.update(R,i,1)}function x(M,R,F){F!==0&&(e.drawElementsInstanced(i,R,o,M*h,F),t.update(R,i,F))}function U(M,R,F){if(F===0)return;n.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,R,0,o,M,0,F);let l=0;for(let r=0;r<F;r++)l+=R[r];t.update(l,i,1)}function E(M,R,F,L){if(F===0)return;const l=n.get("WEBGL_multi_draw");if(l===null)for(let r=0;r<M.length;r++)x(M[r]/h,R[r],L[r]);else{l.multiDrawElementsInstancedWEBGL(i,R,0,o,M,0,L,0,F);let r=0;for(let I=0;I<F;I++)r+=R[I]*L[I];t.update(r,i,1)}}this.setMode=c,this.setIndex=f,this.render=b,this.renderInstances=x,this.renderMultiDraw=U,this.renderMultiDrawInstances=E}function qc(e){const n={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(o,h,f){switch(t.calls++,h){case e.TRIANGLES:t.triangles+=f*(o/3);break;case e.LINES:t.lines+=f*(o/2);break;case e.LINE_STRIP:t.lines+=f*(o-1);break;case e.LINE_LOOP:t.lines+=f*o;break;case e.POINTS:t.points+=f*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",h);break}}function c(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:n,render:t,programs:null,autoReset:!0,reset:c,update:i}}function $c(e,n,t){const i=new WeakMap,c=new ft;function o(h,f,b){const x=h.morphTargetInfluences,U=f.morphAttributes.position||f.morphAttributes.normal||f.morphAttributes.color,E=U!==void 0?U.length:0;let M=i.get(f);if(M===void 0||M.count!==E){let p=function(){N.dispose(),i.delete(f),f.removeEventListener("dispose",p)};M!==void 0&&M.texture.dispose();const R=f.morphAttributes.position!==void 0,F=f.morphAttributes.normal!==void 0,L=f.morphAttributes.color!==void 0,l=f.morphAttributes.position||[],r=f.morphAttributes.normal||[],I=f.morphAttributes.color||[];let A=0;R===!0&&(A=1),F===!0&&(A=2),L===!0&&(A=3);let m=f.attributes.position.count*A,y=1;m>n.maxTextureSize&&(y=Math.ceil(m/n.maxTextureSize),m=n.maxTextureSize);const P=new Float32Array(m*y*4*E),N=new pr(P,m,y,E);N.type=Dt,N.needsUpdate=!0;const V=A*4;for(let d=0;d<E;d++){const g=l[d],Y=r[d],X=I[d],k=m*y*4*d;for(let J=0;J<g.count;J++){const z=J*V;R===!0&&(c.fromBufferAttribute(g,J),P[k+z+0]=c.x,P[k+z+1]=c.y,P[k+z+2]=c.z,P[k+z+3]=0),F===!0&&(c.fromBufferAttribute(Y,J),P[k+z+4]=c.x,P[k+z+5]=c.y,P[k+z+6]=c.z,P[k+z+7]=0),L===!0&&(c.fromBufferAttribute(X,J),P[k+z+8]=c.x,P[k+z+9]=c.y,P[k+z+10]=c.z,P[k+z+11]=X.itemSize===4?c.w:1)}}M={count:E,texture:N,size:new dt(m,y)},i.set(f,M),f.addEventListener("dispose",p)}if(h.isInstancedMesh===!0&&h.morphTexture!==null)b.getUniforms().setValue(e,"morphTexture",h.morphTexture,t);else{let R=0;for(let L=0;L<x.length;L++)R+=x[L];const F=f.morphTargetsRelative?1:1-R;b.getUniforms().setValue(e,"morphTargetBaseInfluence",F),b.getUniforms().setValue(e,"morphTargetInfluences",x)}b.getUniforms().setValue(e,"morphTargetsTexture",M.texture,t),b.getUniforms().setValue(e,"morphTargetsTextureSize",M.size)}return{update:o}}function Zc(e,n,t,i){let c=new WeakMap;function o(b){const x=i.render.frame,U=b.geometry,E=n.get(b,U);if(c.get(E)!==x&&(n.update(E),c.set(E,x)),b.isInstancedMesh&&(b.hasEventListener("dispose",f)===!1&&b.addEventListener("dispose",f),c.get(b)!==x&&(t.update(b.instanceMatrix,e.ARRAY_BUFFER),b.instanceColor!==null&&t.update(b.instanceColor,e.ARRAY_BUFFER),c.set(b,x))),b.isSkinnedMesh){const M=b.skeleton;c.get(M)!==x&&(M.update(),c.set(M,x))}return E}function h(){c=new WeakMap}function f(b){const x=b.target;x.removeEventListener("dispose",f),t.remove(x.instanceMatrix),x.instanceColor!==null&&t.remove(x.instanceColor)}return{update:o,dispose:h}}const Sr=new vr,Bi=new nr(1,1),Mr=new pr,Tr=new Ya,xr=new Xa,Gi=[],Hi=[],Vi=new Float32Array(16),ki=new Float32Array(9),Wi=new Float32Array(4);function kt(e,n,t){const i=e[0];if(i<=0||i>0)return e;const c=n*t;let o=Gi[c];if(o===void 0&&(o=new Float32Array(c),Gi[c]=o),n!==0){i.toArray(o,0);for(let h=1,f=0;h!==n;++h)f+=t,e[h].toArray(o,f)}return o}function rt(e,n){if(e.length!==n.length)return!1;for(let t=0,i=e.length;t<i;t++)if(e[t]!==n[t])return!1;return!0}function at(e,n){for(let t=0,i=n.length;t<i;t++)e[t]=n[t]}function vn(e,n){let t=Hi[n];t===void 0&&(t=new Int32Array(n),Hi[n]=t);for(let i=0;i!==n;++i)t[i]=e.allocateTextureUnit();return t}function Qc(e,n){const t=this.cache;t[0]!==n&&(e.uniform1f(this.addr,n),t[0]=n)}function Jc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2f(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(rt(t,n))return;e.uniform2fv(this.addr,n),at(t,n)}}function jc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3f(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else if(n.r!==void 0)(t[0]!==n.r||t[1]!==n.g||t[2]!==n.b)&&(e.uniform3f(this.addr,n.r,n.g,n.b),t[0]=n.r,t[1]=n.g,t[2]=n.b);else{if(rt(t,n))return;e.uniform3fv(this.addr,n),at(t,n)}}function el(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4f(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(rt(t,n))return;e.uniform4fv(this.addr,n),at(t,n)}}function tl(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(rt(t,n))return;e.uniformMatrix2fv(this.addr,!1,n),at(t,n)}else{if(rt(t,i))return;Wi.set(i),e.uniformMatrix2fv(this.addr,!1,Wi),at(t,i)}}function nl(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(rt(t,n))return;e.uniformMatrix3fv(this.addr,!1,n),at(t,n)}else{if(rt(t,i))return;ki.set(i),e.uniformMatrix3fv(this.addr,!1,ki),at(t,i)}}function il(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(rt(t,n))return;e.uniformMatrix4fv(this.addr,!1,n),at(t,n)}else{if(rt(t,i))return;Vi.set(i),e.uniformMatrix4fv(this.addr,!1,Vi),at(t,i)}}function rl(e,n){const t=this.cache;t[0]!==n&&(e.uniform1i(this.addr,n),t[0]=n)}function al(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2i(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(rt(t,n))return;e.uniform2iv(this.addr,n),at(t,n)}}function ol(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3i(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(rt(t,n))return;e.uniform3iv(this.addr,n),at(t,n)}}function sl(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4i(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(rt(t,n))return;e.uniform4iv(this.addr,n),at(t,n)}}function cl(e,n){const t=this.cache;t[0]!==n&&(e.uniform1ui(this.addr,n),t[0]=n)}function ll(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2ui(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(rt(t,n))return;e.uniform2uiv(this.addr,n),at(t,n)}}function fl(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3ui(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(rt(t,n))return;e.uniform3uiv(this.addr,n),at(t,n)}}function dl(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4ui(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(rt(t,n))return;e.uniform4uiv(this.addr,n),at(t,n)}}function ul(e,n,t){const i=this.cache,c=t.allocateTextureUnit();i[0]!==c&&(e.uniform1i(this.addr,c),i[0]=c);let o;this.type===e.SAMPLER_2D_SHADOW?(Bi.compareFunction=ir,o=Bi):o=Sr,t.setTexture2D(n||o,c)}function pl(e,n,t){const i=this.cache,c=t.allocateTextureUnit();i[0]!==c&&(e.uniform1i(this.addr,c),i[0]=c),t.setTexture3D(n||Tr,c)}function hl(e,n,t){const i=this.cache,c=t.allocateTextureUnit();i[0]!==c&&(e.uniform1i(this.addr,c),i[0]=c),t.setTextureCube(n||xr,c)}function _l(e,n,t){const i=this.cache,c=t.allocateTextureUnit();i[0]!==c&&(e.uniform1i(this.addr,c),i[0]=c),t.setTexture2DArray(n||Mr,c)}function ml(e){switch(e){case 5126:return Qc;case 35664:return Jc;case 35665:return jc;case 35666:return el;case 35674:return tl;case 35675:return nl;case 35676:return il;case 5124:case 35670:return rl;case 35667:case 35671:return al;case 35668:case 35672:return ol;case 35669:case 35673:return sl;case 5125:return cl;case 36294:return ll;case 36295:return fl;case 36296:return dl;case 35678:case 36198:case 36298:case 36306:case 35682:return ul;case 35679:case 36299:case 36307:return pl;case 35680:case 36300:case 36308:case 36293:return hl;case 36289:case 36303:case 36311:case 36292:return _l}}function vl(e,n){e.uniform1fv(this.addr,n)}function gl(e,n){const t=kt(n,this.size,2);e.uniform2fv(this.addr,t)}function El(e,n){const t=kt(n,this.size,3);e.uniform3fv(this.addr,t)}function Sl(e,n){const t=kt(n,this.size,4);e.uniform4fv(this.addr,t)}function Ml(e,n){const t=kt(n,this.size,4);e.uniformMatrix2fv(this.addr,!1,t)}function Tl(e,n){const t=kt(n,this.size,9);e.uniformMatrix3fv(this.addr,!1,t)}function xl(e,n){const t=kt(n,this.size,16);e.uniformMatrix4fv(this.addr,!1,t)}function Al(e,n){e.uniform1iv(this.addr,n)}function Rl(e,n){e.uniform2iv(this.addr,n)}function Cl(e,n){e.uniform3iv(this.addr,n)}function bl(e,n){e.uniform4iv(this.addr,n)}function Pl(e,n){e.uniform1uiv(this.addr,n)}function Ll(e,n){e.uniform2uiv(this.addr,n)}function Ul(e,n){e.uniform3uiv(this.addr,n)}function Dl(e,n){e.uniform4uiv(this.addr,n)}function wl(e,n,t){const i=this.cache,c=n.length,o=vn(t,c);rt(i,o)||(e.uniform1iv(this.addr,o),at(i,o));for(let h=0;h!==c;++h)t.setTexture2D(n[h]||Sr,o[h])}function Il(e,n,t){const i=this.cache,c=n.length,o=vn(t,c);rt(i,o)||(e.uniform1iv(this.addr,o),at(i,o));for(let h=0;h!==c;++h)t.setTexture3D(n[h]||Tr,o[h])}function Nl(e,n,t){const i=this.cache,c=n.length,o=vn(t,c);rt(i,o)||(e.uniform1iv(this.addr,o),at(i,o));for(let h=0;h!==c;++h)t.setTextureCube(n[h]||xr,o[h])}function yl(e,n,t){const i=this.cache,c=n.length,o=vn(t,c);rt(i,o)||(e.uniform1iv(this.addr,o),at(i,o));for(let h=0;h!==c;++h)t.setTexture2DArray(n[h]||Mr,o[h])}function Ol(e){switch(e){case 5126:return vl;case 35664:return gl;case 35665:return El;case 35666:return Sl;case 35674:return Ml;case 35675:return Tl;case 35676:return xl;case 5124:case 35670:return Al;case 35667:case 35671:return Rl;case 35668:case 35672:return Cl;case 35669:case 35673:return bl;case 5125:return Pl;case 36294:return Ll;case 36295:return Ul;case 36296:return Dl;case 35678:case 36198:case 36298:case 36306:case 35682:return wl;case 35679:case 36299:case 36307:return Il;case 35680:case 36300:case 36308:case 36293:return Nl;case 36289:case 36303:case 36311:case 36292:return yl}}class Fl{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.setValue=ml(t.type)}}class Bl{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ol(t.type)}}class Gl{constructor(n){this.id=n,this.seq=[],this.map={}}setValue(n,t,i){const c=this.seq;for(let o=0,h=c.length;o!==h;++o){const f=c[o];f.setValue(n,t[f.id],i)}}}const wn=/(\w+)(\])?(\[|\.)?/g;function zi(e,n){e.seq.push(n),e.map[n.id]=n}function Hl(e,n,t){const i=e.name,c=i.length;for(wn.lastIndex=0;;){const o=wn.exec(i),h=wn.lastIndex;let f=o[1];const b=o[2]==="]",x=o[3];if(b&&(f=f|0),x===void 0||x==="["&&h+2===c){zi(t,x===void 0?new Fl(f,e,n):new Bl(f,e,n));break}else{let E=t.map[f];E===void 0&&(E=new Gl(f),zi(t,E)),t=E}}}class fn{constructor(n,t){this.seq=[],this.map={};const i=n.getProgramParameter(t,n.ACTIVE_UNIFORMS);for(let c=0;c<i;++c){const o=n.getActiveUniform(t,c),h=n.getUniformLocation(t,o.name);Hl(o,h,this)}}setValue(n,t,i,c){const o=this.map[t];o!==void 0&&o.setValue(n,i,c)}setOptional(n,t,i){const c=t[i];c!==void 0&&this.setValue(n,i,c)}static upload(n,t,i,c){for(let o=0,h=t.length;o!==h;++o){const f=t[o],b=i[f.id];b.needsUpdate!==!1&&f.setValue(n,b.value,c)}}static seqWithValue(n,t){const i=[];for(let c=0,o=n.length;c!==o;++c){const h=n[c];h.id in t&&i.push(h)}return i}}function Xi(e,n,t){const i=e.createShader(n);return e.shaderSource(i,t),e.compileShader(i),i}const Vl=37297;let kl=0;function Wl(e,n){const t=e.split(`
`),i=[],c=Math.max(n-6,0),o=Math.min(n+6,t.length);for(let h=c;h<o;h++){const f=h+1;i.push(`${f===n?">":" "} ${f}: ${t[h]}`)}return i.join(`
`)}const Yi=new Be;function zl(e){nt._getMatrix(Yi,nt.workingColorSpace,e);const n=`mat3( ${Yi.elements.map(t=>t.toFixed(4))} )`;switch(nt.getTransfer(e)){case gr:return[n,"LinearTransferOETF"];case qe:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",e),[n,"LinearTransferOETF"]}}function Ki(e,n,t){const i=e.getShaderParameter(n,e.COMPILE_STATUS),o=(e.getShaderInfoLog(n)||"").trim();if(i&&o==="")return"";const h=/ERROR: 0:(\d+)/.exec(o);if(h){const f=parseInt(h[1]);return t.toUpperCase()+`

`+o+`

`+Wl(e.getShaderSource(n),f)}else return o}function Xl(e,n){const t=zl(n);return[`vec4 ${e}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Yl(e,n){let t;switch(n){case za:t="Linear";break;case Wa:t="Reinhard";break;case ka:t="Cineon";break;case Va:t="ACESFilmic";break;case Ha:t="AgX";break;case Ga:t="Neutral";break;case Ba:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",n),t="Linear"}return"vec3 "+e+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const an=new We;function Kl(){nt.getLuminanceCoefficients(an);const e=an.x.toFixed(4),n=an.y.toFixed(4),t=an.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${n}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ql(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Yt).join(`
`)}function $l(e){const n=[];for(const t in e){const i=e[t];i!==!1&&n.push("#define "+t+" "+i)}return n.join(`
`)}function Zl(e,n){const t={},i=e.getProgramParameter(n,e.ACTIVE_ATTRIBUTES);for(let c=0;c<i;c++){const o=e.getActiveAttrib(n,c),h=o.name;let f=1;o.type===e.FLOAT_MAT2&&(f=2),o.type===e.FLOAT_MAT3&&(f=3),o.type===e.FLOAT_MAT4&&(f=4),t[h]={type:o.type,location:e.getAttribLocation(n,h),locationSize:f}}return t}function Yt(e){return e!==""}function qi(e,n){const t=n.numSpotLightShadows+n.numSpotLightMaps-n.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,n.numDirLights).replace(/NUM_SPOT_LIGHTS/g,n.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,n.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,n.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,n.numPointLights).replace(/NUM_HEMI_LIGHTS/g,n.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,n.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,n.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,n.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,n.numPointLightShadows)}function $i(e,n){return e.replace(/NUM_CLIPPING_PLANES/g,n.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,n.numClippingPlanes-n.numClipIntersection)}const Ql=/^[ \t]*#include +<([\w\d./]+)>/gm;function kn(e){return e.replace(Ql,jl)}const Jl=new Map;function jl(e,n){let t=De[n];if(t===void 0){const i=Jl.get(n);if(i!==void 0)t=De[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',n,i);else throw new Error("Can not resolve #include <"+n+">")}return kn(t)}const ef=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Zi(e){return e.replace(ef,tf)}function tf(e,n,t,i){let c="";for(let o=parseInt(n);o<parseInt(t);o++)c+=i.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return c}function Qi(e){let n=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision==="highp"?n+=`
#define HIGH_PRECISION`:e.precision==="mediump"?n+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(n+=`
#define LOW_PRECISION`),n}function nf(e){let n="SHADOWMAP_TYPE_BASIC";return e.shadowMapType===ar?n="SHADOWMAP_TYPE_PCF":e.shadowMapType===Fa?n="SHADOWMAP_TYPE_PCF_SOFT":e.shadowMapType===St&&(n="SHADOWMAP_TYPE_VSM"),n}function rf(e){let n="ENVMAP_TYPE_CUBE";if(e.envMap)switch(e.envMapMode){case Jt:case Vt:n="ENVMAP_TYPE_CUBE";break;case mn:n="ENVMAP_TYPE_CUBE_UV";break}return n}function af(e){let n="ENVMAP_MODE_REFLECTION";if(e.envMap)switch(e.envMapMode){case Vt:n="ENVMAP_MODE_REFRACTION";break}return n}function of(e){let n="ENVMAP_BLENDING_NONE";if(e.envMap)switch(e.combine){case Za:n="ENVMAP_BLENDING_MULTIPLY";break;case $a:n="ENVMAP_BLENDING_MIX";break;case qa:n="ENVMAP_BLENDING_ADD";break}return n}function sf(e){const n=e.envMapCubeUVHeight;if(n===null)return null;const t=Math.log2(n)-2,i=1/n;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function cf(e,n,t,i){const c=e.getContext(),o=t.defines;let h=t.vertexShader,f=t.fragmentShader;const b=nf(t),x=rf(t),U=af(t),E=of(t),M=sf(t),R=ql(t),F=$l(o),L=c.createProgram();let l,r,I=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(l=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,F].filter(Yt).join(`
`),l.length>0&&(l+=`
`),r=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,F].filter(Yt).join(`
`),r.length>0&&(r+=`
`)):(l=[Qi(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,F,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+U:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+b:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Yt).join(`
`),r=[Qi(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,F,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+x:"",t.envMap?"#define "+U:"",t.envMap?"#define "+E:"",M?"#define CUBEUV_TEXEL_WIDTH "+M.texelWidth:"",M?"#define CUBEUV_TEXEL_HEIGHT "+M.texelHeight:"",M?"#define CUBEUV_MAX_MIP "+M.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+b:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==At?"#define TONE_MAPPING":"",t.toneMapping!==At?De.tonemapping_pars_fragment:"",t.toneMapping!==At?Yl("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",De.colorspace_pars_fragment,Xl("linearToOutputTexel",t.outputColorSpace),Kl(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Yt).join(`
`)),h=kn(h),h=qi(h,t),h=$i(h,t),f=kn(f),f=qi(f,t),f=$i(f,t),h=Zi(h),f=Zi(f),t.isRawShaderMaterial!==!0&&(I=`#version 300 es
`,l=[R,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+l,r=["#define varying in",t.glslVersion===Ui?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ui?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+r);const A=I+l+h,m=I+r+f,y=Xi(c,c.VERTEX_SHADER,A),P=Xi(c,c.FRAGMENT_SHADER,m);c.attachShader(L,y),c.attachShader(L,P),t.index0AttributeName!==void 0?c.bindAttribLocation(L,0,t.index0AttributeName):t.morphTargets===!0&&c.bindAttribLocation(L,0,"position"),c.linkProgram(L);function N(g){if(e.debug.checkShaderErrors){const Y=c.getProgramInfoLog(L)||"",X=c.getShaderInfoLog(y)||"",k=c.getShaderInfoLog(P)||"",J=Y.trim(),z=X.trim(),ne=k.trim();let G=!0,ve=!0;if(c.getProgramParameter(L,c.LINK_STATUS)===!1)if(G=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(c,L,y,P);else{const Te=Ki(c,y,"vertex"),we=Ki(c,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+c.getError()+" - VALIDATE_STATUS "+c.getProgramParameter(L,c.VALIDATE_STATUS)+`

Material Name: `+g.name+`
Material Type: `+g.type+`

Program Info Log: `+J+`
`+Te+`
`+we)}else J!==""?console.warn("THREE.WebGLProgram: Program Info Log:",J):(z===""||ne==="")&&(ve=!1);ve&&(g.diagnostics={runnable:G,programLog:J,vertexShader:{log:z,prefix:l},fragmentShader:{log:ne,prefix:r}})}c.deleteShader(y),c.deleteShader(P),V=new fn(c,L),p=Zl(c,L)}let V;this.getUniforms=function(){return V===void 0&&N(this),V};let p;this.getAttributes=function(){return p===void 0&&N(this),p};let d=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return d===!1&&(d=c.getProgramParameter(L,Vl)),d},this.destroy=function(){i.releaseStatesOfProgram(this),c.deleteProgram(L),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=kl++,this.cacheKey=n,this.usedTimes=1,this.program=L,this.vertexShader=y,this.fragmentShader=P,this}let lf=0;class ff{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(n){const t=n.vertexShader,i=n.fragmentShader,c=this._getShaderStage(t),o=this._getShaderStage(i),h=this._getShaderCacheForMaterial(n);return h.has(c)===!1&&(h.add(c),c.usedTimes++),h.has(o)===!1&&(h.add(o),o.usedTimes++),this}remove(n){const t=this.materialCache.get(n);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(n),this}getVertexShaderID(n){return this._getShaderStage(n.vertexShader).id}getFragmentShaderID(n){return this._getShaderStage(n.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(n){const t=this.materialCache;let i=t.get(n);return i===void 0&&(i=new Set,t.set(n,i)),i}_getShaderStage(n){const t=this.shaderCache;let i=t.get(n);return i===void 0&&(i=new df(n),t.set(n,i)),i}}class df{constructor(n){this.id=lf++,this.code=n,this.usedTimes=0}}function uf(e,n,t,i,c,o,h){const f=new Oa,b=new ff,x=new Set,U=[],E=c.logarithmicDepthBuffer,M=c.vertexTextures;let R=c.precision;const F={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function L(p){return x.add(p),p===0?"uv":`uv${p}`}function l(p,d,g,Y,X){const k=Y.fog,J=X.geometry,z=p.isMeshStandardMaterial?Y.environment:null,ne=(p.isMeshStandardMaterial?t:n).get(p.envMap||z),G=ne&&ne.mapping===mn?ne.image.height:null,ve=F[p.type];p.precision!==null&&(R=c.getMaxPrecision(p.precision),R!==p.precision&&console.warn("THREE.WebGLProgram.getParameters:",p.precision,"not supported, using",R,"instead."));const Te=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,we=Te!==void 0?Te.length:0;let Oe=0;J.morphAttributes.position!==void 0&&(Oe=1),J.morphAttributes.normal!==void 0&&(Oe=2),J.morphAttributes.color!==void 0&&(Oe=3);let it,Ye,H,re;if(ve){const He=gt[ve];it=He.vertexShader,Ye=He.fragmentShader}else it=p.vertexShader,Ye=p.fragmentShader,b.update(p),H=b.getVertexShaderID(p),re=b.getFragmentShaderID(p);const ee=e.getRenderTarget(),xe=e.state.buffers.depth.getReversed(),Ae=X.isInstancedMesh===!0,Pe=X.isBatchedMesh===!0,et=!!p.map,ye=!!p.matcap,_=!!ne,ze=!!p.aoMap,Se=!!p.lightMap,Ge=!!p.bumpMap,ge=!!p.normalMap,$e=!!p.displacementMap,fe=!!p.emissiveMap,Ie=!!p.metalnessMap,ot=!!p.roughnessMap,tt=p.anisotropy>0,u=p.clearcoat>0,a=p.dispersion>0,C=p.iridescence>0,B=p.sheen>0,K=p.transmission>0,O=tt&&!!p.anisotropyMap,me=u&&!!p.clearcoatMap,j=u&&!!p.clearcoatNormalMap,pe=u&&!!p.clearcoatRoughnessMap,he=C&&!!p.iridescenceMap,Z=C&&!!p.iridescenceThicknessMap,se=B&&!!p.sheenColorMap,Ce=B&&!!p.sheenRoughnessMap,_e=!!p.specularMap,ae=!!p.specularColorMap,Ue=!!p.specularIntensityMap,v=K&&!!p.transmissionMap,Q=K&&!!p.thicknessMap,te=!!p.gradientMap,le=!!p.alphaMap,q=p.alphaTest>0,W=!!p.alphaHash,ue=!!p.extensions;let Le=At;p.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(Le=e.toneMapping);const Xe={shaderID:ve,shaderType:p.type,shaderName:p.name,vertexShader:it,fragmentShader:Ye,defines:p.defines,customVertexShaderID:H,customFragmentShaderID:re,isRawShaderMaterial:p.isRawShaderMaterial===!0,glslVersion:p.glslVersion,precision:R,batching:Pe,batchingColor:Pe&&X._colorsTexture!==null,instancing:Ae,instancingColor:Ae&&X.instanceColor!==null,instancingMorph:Ae&&X.morphTexture!==null,supportsVertexTextures:M,outputColorSpace:ee===null?e.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:_n,alphaToCoverage:!!p.alphaToCoverage,map:et,matcap:ye,envMap:_,envMapMode:_&&ne.mapping,envMapCubeUVHeight:G,aoMap:ze,lightMap:Se,bumpMap:Ge,normalMap:ge,displacementMap:M&&$e,emissiveMap:fe,normalMapObjectSpace:ge&&p.normalMapType===Ua,normalMapTangentSpace:ge&&p.normalMapType===La,metalnessMap:Ie,roughnessMap:ot,anisotropy:tt,anisotropyMap:O,clearcoat:u,clearcoatMap:me,clearcoatNormalMap:j,clearcoatRoughnessMap:pe,dispersion:a,iridescence:C,iridescenceMap:he,iridescenceThicknessMap:Z,sheen:B,sheenColorMap:se,sheenRoughnessMap:Ce,specularMap:_e,specularColorMap:ae,specularIntensityMap:Ue,transmission:K,transmissionMap:v,thicknessMap:Q,gradientMap:te,opaque:p.transparent===!1&&p.blending===ln&&p.alphaToCoverage===!1,alphaMap:le,alphaTest:q,alphaHash:W,combine:p.combine,mapUv:et&&L(p.map.channel),aoMapUv:ze&&L(p.aoMap.channel),lightMapUv:Se&&L(p.lightMap.channel),bumpMapUv:Ge&&L(p.bumpMap.channel),normalMapUv:ge&&L(p.normalMap.channel),displacementMapUv:$e&&L(p.displacementMap.channel),emissiveMapUv:fe&&L(p.emissiveMap.channel),metalnessMapUv:Ie&&L(p.metalnessMap.channel),roughnessMapUv:ot&&L(p.roughnessMap.channel),anisotropyMapUv:O&&L(p.anisotropyMap.channel),clearcoatMapUv:me&&L(p.clearcoatMap.channel),clearcoatNormalMapUv:j&&L(p.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:pe&&L(p.clearcoatRoughnessMap.channel),iridescenceMapUv:he&&L(p.iridescenceMap.channel),iridescenceThicknessMapUv:Z&&L(p.iridescenceThicknessMap.channel),sheenColorMapUv:se&&L(p.sheenColorMap.channel),sheenRoughnessMapUv:Ce&&L(p.sheenRoughnessMap.channel),specularMapUv:_e&&L(p.specularMap.channel),specularColorMapUv:ae&&L(p.specularColorMap.channel),specularIntensityMapUv:Ue&&L(p.specularIntensityMap.channel),transmissionMapUv:v&&L(p.transmissionMap.channel),thicknessMapUv:Q&&L(p.thicknessMap.channel),alphaMapUv:le&&L(p.alphaMap.channel),vertexTangents:!!J.attributes.tangent&&(ge||tt),vertexColors:p.vertexColors,vertexAlphas:p.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,pointsUvs:X.isPoints===!0&&!!J.attributes.uv&&(et||le),fog:!!k,useFog:p.fog===!0,fogExp2:!!k&&k.isFogExp2,flatShading:p.flatShading===!0&&p.wireframe===!1,sizeAttenuation:p.sizeAttenuation===!0,logarithmicDepthBuffer:E,reversedDepthBuffer:xe,skinning:X.isSkinnedMesh===!0,morphTargets:J.morphAttributes.position!==void 0,morphNormals:J.morphAttributes.normal!==void 0,morphColors:J.morphAttributes.color!==void 0,morphTargetsCount:we,morphTextureStride:Oe,numDirLights:d.directional.length,numPointLights:d.point.length,numSpotLights:d.spot.length,numSpotLightMaps:d.spotLightMap.length,numRectAreaLights:d.rectArea.length,numHemiLights:d.hemi.length,numDirLightShadows:d.directionalShadowMap.length,numPointLightShadows:d.pointShadowMap.length,numSpotLightShadows:d.spotShadowMap.length,numSpotLightShadowsWithMaps:d.numSpotLightShadowsWithMaps,numLightProbes:d.numLightProbes,numClippingPlanes:h.numPlanes,numClipIntersection:h.numIntersection,dithering:p.dithering,shadowMapEnabled:e.shadowMap.enabled&&g.length>0,shadowMapType:e.shadowMap.type,toneMapping:Le,decodeVideoTexture:et&&p.map.isVideoTexture===!0&&nt.getTransfer(p.map.colorSpace)===qe,decodeVideoTextureEmissive:fe&&p.emissiveMap.isVideoTexture===!0&&nt.getTransfer(p.emissiveMap.colorSpace)===qe,premultipliedAlpha:p.premultipliedAlpha,doubleSided:p.side===Mt,flipSided:p.side===mt,useDepthPacking:p.depthPacking>=0,depthPacking:p.depthPacking||0,index0AttributeName:p.index0AttributeName,extensionClipCullDistance:ue&&p.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ue&&p.extensions.multiDraw===!0||Pe)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:p.customProgramCacheKey()};return Xe.vertexUv1s=x.has(1),Xe.vertexUv2s=x.has(2),Xe.vertexUv3s=x.has(3),x.clear(),Xe}function r(p){const d=[];if(p.shaderID?d.push(p.shaderID):(d.push(p.customVertexShaderID),d.push(p.customFragmentShaderID)),p.defines!==void 0)for(const g in p.defines)d.push(g),d.push(p.defines[g]);return p.isRawShaderMaterial===!1&&(I(d,p),A(d,p),d.push(e.outputColorSpace)),d.push(p.customProgramCacheKey),d.join()}function I(p,d){p.push(d.precision),p.push(d.outputColorSpace),p.push(d.envMapMode),p.push(d.envMapCubeUVHeight),p.push(d.mapUv),p.push(d.alphaMapUv),p.push(d.lightMapUv),p.push(d.aoMapUv),p.push(d.bumpMapUv),p.push(d.normalMapUv),p.push(d.displacementMapUv),p.push(d.emissiveMapUv),p.push(d.metalnessMapUv),p.push(d.roughnessMapUv),p.push(d.anisotropyMapUv),p.push(d.clearcoatMapUv),p.push(d.clearcoatNormalMapUv),p.push(d.clearcoatRoughnessMapUv),p.push(d.iridescenceMapUv),p.push(d.iridescenceThicknessMapUv),p.push(d.sheenColorMapUv),p.push(d.sheenRoughnessMapUv),p.push(d.specularMapUv),p.push(d.specularColorMapUv),p.push(d.specularIntensityMapUv),p.push(d.transmissionMapUv),p.push(d.thicknessMapUv),p.push(d.combine),p.push(d.fogExp2),p.push(d.sizeAttenuation),p.push(d.morphTargetsCount),p.push(d.morphAttributeCount),p.push(d.numDirLights),p.push(d.numPointLights),p.push(d.numSpotLights),p.push(d.numSpotLightMaps),p.push(d.numHemiLights),p.push(d.numRectAreaLights),p.push(d.numDirLightShadows),p.push(d.numPointLightShadows),p.push(d.numSpotLightShadows),p.push(d.numSpotLightShadowsWithMaps),p.push(d.numLightProbes),p.push(d.shadowMapType),p.push(d.toneMapping),p.push(d.numClippingPlanes),p.push(d.numClipIntersection),p.push(d.depthPacking)}function A(p,d){f.disableAll(),d.supportsVertexTextures&&f.enable(0),d.instancing&&f.enable(1),d.instancingColor&&f.enable(2),d.instancingMorph&&f.enable(3),d.matcap&&f.enable(4),d.envMap&&f.enable(5),d.normalMapObjectSpace&&f.enable(6),d.normalMapTangentSpace&&f.enable(7),d.clearcoat&&f.enable(8),d.iridescence&&f.enable(9),d.alphaTest&&f.enable(10),d.vertexColors&&f.enable(11),d.vertexAlphas&&f.enable(12),d.vertexUv1s&&f.enable(13),d.vertexUv2s&&f.enable(14),d.vertexUv3s&&f.enable(15),d.vertexTangents&&f.enable(16),d.anisotropy&&f.enable(17),d.alphaHash&&f.enable(18),d.batching&&f.enable(19),d.dispersion&&f.enable(20),d.batchingColor&&f.enable(21),d.gradientMap&&f.enable(22),p.push(f.mask),f.disableAll(),d.fog&&f.enable(0),d.useFog&&f.enable(1),d.flatShading&&f.enable(2),d.logarithmicDepthBuffer&&f.enable(3),d.reversedDepthBuffer&&f.enable(4),d.skinning&&f.enable(5),d.morphTargets&&f.enable(6),d.morphNormals&&f.enable(7),d.morphColors&&f.enable(8),d.premultipliedAlpha&&f.enable(9),d.shadowMapEnabled&&f.enable(10),d.doubleSided&&f.enable(11),d.flipSided&&f.enable(12),d.useDepthPacking&&f.enable(13),d.dithering&&f.enable(14),d.transmission&&f.enable(15),d.sheen&&f.enable(16),d.opaque&&f.enable(17),d.pointsUvs&&f.enable(18),d.decodeVideoTexture&&f.enable(19),d.decodeVideoTextureEmissive&&f.enable(20),d.alphaToCoverage&&f.enable(21),p.push(f.mask)}function m(p){const d=F[p.type];let g;if(d){const Y=gt[d];g=Pa.clone(Y.uniforms)}else g=p.uniforms;return g}function y(p,d){let g;for(let Y=0,X=U.length;Y<X;Y++){const k=U[Y];if(k.cacheKey===d){g=k,++g.usedTimes;break}}return g===void 0&&(g=new cf(e,d,p,o),U.push(g)),g}function P(p){if(--p.usedTimes===0){const d=U.indexOf(p);U[d]=U[U.length-1],U.pop(),p.destroy()}}function N(p){b.remove(p)}function V(){b.dispose()}return{getParameters:l,getProgramCacheKey:r,getUniforms:m,acquireProgram:y,releaseProgram:P,releaseShaderCache:N,programs:U,dispose:V}}function pf(){let e=new WeakMap;function n(h){return e.has(h)}function t(h){let f=e.get(h);return f===void 0&&(f={},e.set(h,f)),f}function i(h){e.delete(h)}function c(h,f,b){e.get(h)[f]=b}function o(){e=new WeakMap}return{has:n,get:t,remove:i,update:c,dispose:o}}function hf(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.material.id!==n.material.id?e.material.id-n.material.id:e.z!==n.z?e.z-n.z:e.id-n.id}function Ji(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.z!==n.z?n.z-e.z:e.id-n.id}function ji(){const e=[];let n=0;const t=[],i=[],c=[];function o(){n=0,t.length=0,i.length=0,c.length=0}function h(E,M,R,F,L,l){let r=e[n];return r===void 0?(r={id:E.id,object:E,geometry:M,material:R,groupOrder:F,renderOrder:E.renderOrder,z:L,group:l},e[n]=r):(r.id=E.id,r.object=E,r.geometry=M,r.material=R,r.groupOrder=F,r.renderOrder=E.renderOrder,r.z=L,r.group=l),n++,r}function f(E,M,R,F,L,l){const r=h(E,M,R,F,L,l);R.transmission>0?i.push(r):R.transparent===!0?c.push(r):t.push(r)}function b(E,M,R,F,L,l){const r=h(E,M,R,F,L,l);R.transmission>0?i.unshift(r):R.transparent===!0?c.unshift(r):t.unshift(r)}function x(E,M){t.length>1&&t.sort(E||hf),i.length>1&&i.sort(M||Ji),c.length>1&&c.sort(M||Ji)}function U(){for(let E=n,M=e.length;E<M;E++){const R=e[E];if(R.id===null)break;R.id=null,R.object=null,R.geometry=null,R.material=null,R.group=null}}return{opaque:t,transmissive:i,transparent:c,init:o,push:f,unshift:b,finish:U,sort:x}}function _f(){let e=new WeakMap;function n(i,c){const o=e.get(i);let h;return o===void 0?(h=new ji,e.set(i,[h])):c>=o.length?(h=new ji,o.push(h)):h=o[c],h}function t(){e=new WeakMap}return{get:n,dispose:t}}function mf(){const e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"DirectionalLight":t={direction:new We,color:new Ze};break;case"SpotLight":t={position:new We,direction:new We,color:new Ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new We,color:new Ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new We,skyColor:new Ze,groundColor:new Ze};break;case"RectAreaLight":t={color:new Ze,position:new We,halfWidth:new We,halfHeight:new We};break}return e[n.id]=t,t}}}function vf(){const e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[n.id]=t,t}}}let gf=0;function Ef(e,n){return(n.castShadow?2:0)-(e.castShadow?2:0)+(n.map?1:0)-(e.map?1:0)}function Sf(e){const n=new mf,t=vf(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let x=0;x<9;x++)i.probe.push(new We);const c=new We,o=new qt,h=new qt;function f(x){let U=0,E=0,M=0;for(let p=0;p<9;p++)i.probe[p].set(0,0,0);let R=0,F=0,L=0,l=0,r=0,I=0,A=0,m=0,y=0,P=0,N=0;x.sort(Ef);for(let p=0,d=x.length;p<d;p++){const g=x[p],Y=g.color,X=g.intensity,k=g.distance,J=g.shadow&&g.shadow.map?g.shadow.map.texture:null;if(g.isAmbientLight)U+=Y.r*X,E+=Y.g*X,M+=Y.b*X;else if(g.isLightProbe){for(let z=0;z<9;z++)i.probe[z].addScaledVector(g.sh.coefficients[z],X);N++}else if(g.isDirectionalLight){const z=n.get(g);if(z.color.copy(g.color).multiplyScalar(g.intensity),g.castShadow){const ne=g.shadow,G=t.get(g);G.shadowIntensity=ne.intensity,G.shadowBias=ne.bias,G.shadowNormalBias=ne.normalBias,G.shadowRadius=ne.radius,G.shadowMapSize=ne.mapSize,i.directionalShadow[R]=G,i.directionalShadowMap[R]=J,i.directionalShadowMatrix[R]=g.shadow.matrix,I++}i.directional[R]=z,R++}else if(g.isSpotLight){const z=n.get(g);z.position.setFromMatrixPosition(g.matrixWorld),z.color.copy(Y).multiplyScalar(X),z.distance=k,z.coneCos=Math.cos(g.angle),z.penumbraCos=Math.cos(g.angle*(1-g.penumbra)),z.decay=g.decay,i.spot[L]=z;const ne=g.shadow;if(g.map&&(i.spotLightMap[y]=g.map,y++,ne.updateMatrices(g),g.castShadow&&P++),i.spotLightMatrix[L]=ne.matrix,g.castShadow){const G=t.get(g);G.shadowIntensity=ne.intensity,G.shadowBias=ne.bias,G.shadowNormalBias=ne.normalBias,G.shadowRadius=ne.radius,G.shadowMapSize=ne.mapSize,i.spotShadow[L]=G,i.spotShadowMap[L]=J,m++}L++}else if(g.isRectAreaLight){const z=n.get(g);z.color.copy(Y).multiplyScalar(X),z.halfWidth.set(g.width*.5,0,0),z.halfHeight.set(0,g.height*.5,0),i.rectArea[l]=z,l++}else if(g.isPointLight){const z=n.get(g);if(z.color.copy(g.color).multiplyScalar(g.intensity),z.distance=g.distance,z.decay=g.decay,g.castShadow){const ne=g.shadow,G=t.get(g);G.shadowIntensity=ne.intensity,G.shadowBias=ne.bias,G.shadowNormalBias=ne.normalBias,G.shadowRadius=ne.radius,G.shadowMapSize=ne.mapSize,G.shadowCameraNear=ne.camera.near,G.shadowCameraFar=ne.camera.far,i.pointShadow[F]=G,i.pointShadowMap[F]=J,i.pointShadowMatrix[F]=g.shadow.matrix,A++}i.point[F]=z,F++}else if(g.isHemisphereLight){const z=n.get(g);z.skyColor.copy(g.color).multiplyScalar(X),z.groundColor.copy(g.groundColor).multiplyScalar(X),i.hemi[r]=z,r++}}l>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ie.LTC_FLOAT_1,i.rectAreaLTC2=ie.LTC_FLOAT_2):(i.rectAreaLTC1=ie.LTC_HALF_1,i.rectAreaLTC2=ie.LTC_HALF_2)),i.ambient[0]=U,i.ambient[1]=E,i.ambient[2]=M;const V=i.hash;(V.directionalLength!==R||V.pointLength!==F||V.spotLength!==L||V.rectAreaLength!==l||V.hemiLength!==r||V.numDirectionalShadows!==I||V.numPointShadows!==A||V.numSpotShadows!==m||V.numSpotMaps!==y||V.numLightProbes!==N)&&(i.directional.length=R,i.spot.length=L,i.rectArea.length=l,i.point.length=F,i.hemi.length=r,i.directionalShadow.length=I,i.directionalShadowMap.length=I,i.pointShadow.length=A,i.pointShadowMap.length=A,i.spotShadow.length=m,i.spotShadowMap.length=m,i.directionalShadowMatrix.length=I,i.pointShadowMatrix.length=A,i.spotLightMatrix.length=m+y-P,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=P,i.numLightProbes=N,V.directionalLength=R,V.pointLength=F,V.spotLength=L,V.rectAreaLength=l,V.hemiLength=r,V.numDirectionalShadows=I,V.numPointShadows=A,V.numSpotShadows=m,V.numSpotMaps=y,V.numLightProbes=N,i.version=gf++)}function b(x,U){let E=0,M=0,R=0,F=0,L=0;const l=U.matrixWorldInverse;for(let r=0,I=x.length;r<I;r++){const A=x[r];if(A.isDirectionalLight){const m=i.directional[E];m.direction.setFromMatrixPosition(A.matrixWorld),c.setFromMatrixPosition(A.target.matrixWorld),m.direction.sub(c),m.direction.transformDirection(l),E++}else if(A.isSpotLight){const m=i.spot[R];m.position.setFromMatrixPosition(A.matrixWorld),m.position.applyMatrix4(l),m.direction.setFromMatrixPosition(A.matrixWorld),c.setFromMatrixPosition(A.target.matrixWorld),m.direction.sub(c),m.direction.transformDirection(l),R++}else if(A.isRectAreaLight){const m=i.rectArea[F];m.position.setFromMatrixPosition(A.matrixWorld),m.position.applyMatrix4(l),h.identity(),o.copy(A.matrixWorld),o.premultiply(l),h.extractRotation(o),m.halfWidth.set(A.width*.5,0,0),m.halfHeight.set(0,A.height*.5,0),m.halfWidth.applyMatrix4(h),m.halfHeight.applyMatrix4(h),F++}else if(A.isPointLight){const m=i.point[M];m.position.setFromMatrixPosition(A.matrixWorld),m.position.applyMatrix4(l),M++}else if(A.isHemisphereLight){const m=i.hemi[L];m.direction.setFromMatrixPosition(A.matrixWorld),m.direction.transformDirection(l),L++}}}return{setup:f,setupView:b,state:i}}function er(e){const n=new Sf(e),t=[],i=[];function c(U){x.camera=U,t.length=0,i.length=0}function o(U){t.push(U)}function h(U){i.push(U)}function f(){n.setup(t)}function b(U){n.setupView(t,U)}const x={lightsArray:t,shadowsArray:i,camera:null,lights:n,transmissionRenderTarget:{}};return{init:c,state:x,setupLights:f,setupLightsView:b,pushLight:o,pushShadow:h}}function Mf(e){let n=new WeakMap;function t(c,o=0){const h=n.get(c);let f;return h===void 0?(f=new er(e),n.set(c,[f])):o>=h.length?(f=new er(e),h.push(f)):f=h[o],f}function i(){n=new WeakMap}return{get:t,dispose:i}}const Tf=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,xf=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Af(e,n,t){let i=new tr;const c=new dt,o=new dt,h=new ft,f=new pa({depthPacking:ha}),b=new _a,x={},U=t.maxTextureSize,E={[$t]:mt,[mt]:$t,[Mt]:Mt},M=new Nt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new dt},radius:{value:4}},vertexShader:Tf,fragmentShader:xf}),R=M.clone();R.defines.HORIZONTAL_PASS=1;const F=new rr;F.setAttribute("position",new cn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const L=new xt(F,M),l=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ar;let r=this.type;this.render=function(P,N,V){if(l.enabled===!1||l.autoUpdate===!1&&l.needsUpdate===!1||P.length===0)return;const p=e.getRenderTarget(),d=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),Y=e.state;Y.setBlending(wt),Y.buffers.depth.getReversed()?Y.buffers.color.setClear(0,0,0,0):Y.buffers.color.setClear(1,1,1,1),Y.buffers.depth.setTest(!0),Y.setScissorTest(!1);const X=r!==St&&this.type===St,k=r===St&&this.type!==St;for(let J=0,z=P.length;J<z;J++){const ne=P[J],G=ne.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",ne,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;c.copy(G.mapSize);const ve=G.getFrameExtents();if(c.multiply(ve),o.copy(G.mapSize),(c.x>U||c.y>U)&&(c.x>U&&(o.x=Math.floor(U/ve.x),c.x=o.x*ve.x,G.mapSize.x=o.x),c.y>U&&(o.y=Math.floor(U/ve.y),c.y=o.y*ve.y,G.mapSize.y=o.y)),G.map===null||X===!0||k===!0){const we=this.type!==St?{minFilter:Kt,magFilter:Kt}:{};G.map!==null&&G.map.dispose(),G.map=new Ht(c.x,c.y,we),G.map.texture.name=ne.name+".shadowMap",G.camera.updateProjectionMatrix()}e.setRenderTarget(G.map),e.clear();const Te=G.getViewportCount();for(let we=0;we<Te;we++){const Oe=G.getViewport(we);h.set(o.x*Oe.x,o.y*Oe.y,o.x*Oe.z,o.y*Oe.w),Y.viewport(h),G.updateMatrices(ne,we),i=G.getFrustum(),m(N,V,G.camera,ne,this.type)}G.isPointLightShadow!==!0&&this.type===St&&I(G,V),G.needsUpdate=!1}r=this.type,l.needsUpdate=!1,e.setRenderTarget(p,d,g)};function I(P,N){const V=n.update(L);M.defines.VSM_SAMPLES!==P.blurSamples&&(M.defines.VSM_SAMPLES=P.blurSamples,R.defines.VSM_SAMPLES=P.blurSamples,M.needsUpdate=!0,R.needsUpdate=!0),P.mapPass===null&&(P.mapPass=new Ht(c.x,c.y)),M.uniforms.shadow_pass.value=P.map.texture,M.uniforms.resolution.value=P.mapSize,M.uniforms.radius.value=P.radius,e.setRenderTarget(P.mapPass),e.clear(),e.renderBufferDirect(N,null,V,M,L,null),R.uniforms.shadow_pass.value=P.mapPass.texture,R.uniforms.resolution.value=P.mapSize,R.uniforms.radius.value=P.radius,e.setRenderTarget(P.map),e.clear(),e.renderBufferDirect(N,null,V,R,L,null)}function A(P,N,V,p){let d=null;const g=V.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(g!==void 0)d=g;else if(d=V.isPointLight===!0?b:f,e.localClippingEnabled&&N.clipShadows===!0&&Array.isArray(N.clippingPlanes)&&N.clippingPlanes.length!==0||N.displacementMap&&N.displacementScale!==0||N.alphaMap&&N.alphaTest>0||N.map&&N.alphaTest>0||N.alphaToCoverage===!0){const Y=d.uuid,X=N.uuid;let k=x[Y];k===void 0&&(k={},x[Y]=k);let J=k[X];J===void 0&&(J=d.clone(),k[X]=J,N.addEventListener("dispose",y)),d=J}if(d.visible=N.visible,d.wireframe=N.wireframe,p===St?d.side=N.shadowSide!==null?N.shadowSide:N.side:d.side=N.shadowSide!==null?N.shadowSide:E[N.side],d.alphaMap=N.alphaMap,d.alphaTest=N.alphaToCoverage===!0?.5:N.alphaTest,d.map=N.map,d.clipShadows=N.clipShadows,d.clippingPlanes=N.clippingPlanes,d.clipIntersection=N.clipIntersection,d.displacementMap=N.displacementMap,d.displacementScale=N.displacementScale,d.displacementBias=N.displacementBias,d.wireframeLinewidth=N.wireframeLinewidth,d.linewidth=N.linewidth,V.isPointLight===!0&&d.isMeshDistanceMaterial===!0){const Y=e.properties.get(d);Y.light=V}return d}function m(P,N,V,p,d){if(P.visible===!1)return;if(P.layers.test(N.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&d===St)&&(!P.frustumCulled||i.intersectsObject(P))){P.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,P.matrixWorld);const X=n.update(P),k=P.material;if(Array.isArray(k)){const J=X.groups;for(let z=0,ne=J.length;z<ne;z++){const G=J[z],ve=k[G.materialIndex];if(ve&&ve.visible){const Te=A(P,ve,p,d);P.onBeforeShadow(e,P,N,V,X,Te,G),e.renderBufferDirect(V,null,X,Te,P,G),P.onAfterShadow(e,P,N,V,X,Te,G)}}}else if(k.visible){const J=A(P,k,p,d);P.onBeforeShadow(e,P,N,V,X,J,null),e.renderBufferDirect(V,null,X,J,P,null),P.onAfterShadow(e,P,N,V,X,J,null)}}const Y=P.children;for(let X=0,k=Y.length;X<k;X++)m(Y[X],N,V,p,d)}function y(P){P.target.removeEventListener("dispose",y);for(const V in x){const p=x[V],d=P.target.uuid;d in p&&(p[d].dispose(),delete p[d])}}}const Rf={[Gn]:Bn,[Fn]:Nn,[On]:In,[un]:yn,[Bn]:Gn,[Nn]:Fn,[In]:On,[yn]:un};function Cf(e,n){function t(){let v=!1;const Q=new ft;let te=null;const le=new ft(0,0,0,0);return{setMask:function(q){te!==q&&!v&&(e.colorMask(q,q,q,q),te=q)},setLocked:function(q){v=q},setClear:function(q,W,ue,Le,Xe){Xe===!0&&(q*=Le,W*=Le,ue*=Le),Q.set(q,W,ue,Le),le.equals(Q)===!1&&(e.clearColor(q,W,ue,Le),le.copy(Q))},reset:function(){v=!1,te=null,le.set(-1,0,0,0)}}}function i(){let v=!1,Q=!1,te=null,le=null,q=null;return{setReversed:function(W){if(Q!==W){const ue=n.get("EXT_clip_control");W?ue.clipControlEXT(ue.LOWER_LEFT_EXT,ue.ZERO_TO_ONE_EXT):ue.clipControlEXT(ue.LOWER_LEFT_EXT,ue.NEGATIVE_ONE_TO_ONE_EXT),Q=W;const Le=q;q=null,this.setClear(Le)}},getReversed:function(){return Q},setTest:function(W){W?ee(e.DEPTH_TEST):xe(e.DEPTH_TEST)},setMask:function(W){te!==W&&!v&&(e.depthMask(W),te=W)},setFunc:function(W){if(Q&&(W=Rf[W]),le!==W){switch(W){case Gn:e.depthFunc(e.NEVER);break;case Bn:e.depthFunc(e.ALWAYS);break;case Fn:e.depthFunc(e.LESS);break;case un:e.depthFunc(e.LEQUAL);break;case On:e.depthFunc(e.EQUAL);break;case yn:e.depthFunc(e.GEQUAL);break;case Nn:e.depthFunc(e.GREATER);break;case In:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}le=W}},setLocked:function(W){v=W},setClear:function(W){q!==W&&(Q&&(W=1-W),e.clearDepth(W),q=W)},reset:function(){v=!1,te=null,le=null,q=null,Q=!1}}}function c(){let v=!1,Q=null,te=null,le=null,q=null,W=null,ue=null,Le=null,Xe=null;return{setTest:function(He){v||(He?ee(e.STENCIL_TEST):xe(e.STENCIL_TEST))},setMask:function(He){Q!==He&&!v&&(e.stencilMask(He),Q=He)},setFunc:function(He,Et,vt){(te!==He||le!==Et||q!==vt)&&(e.stencilFunc(He,Et,vt),te=He,le=Et,q=vt)},setOp:function(He,Et,vt){(W!==He||ue!==Et||Le!==vt)&&(e.stencilOp(He,Et,vt),W=He,ue=Et,Le=vt)},setLocked:function(He){v=He},setClear:function(He){Xe!==He&&(e.clearStencil(He),Xe=He)},reset:function(){v=!1,Q=null,te=null,le=null,q=null,W=null,ue=null,Le=null,Xe=null}}}const o=new t,h=new i,f=new c,b=new WeakMap,x=new WeakMap;let U={},E={},M=new WeakMap,R=[],F=null,L=!1,l=null,r=null,I=null,A=null,m=null,y=null,P=null,N=new Ze(0,0,0),V=0,p=!1,d=null,g=null,Y=null,X=null,k=null;const J=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,ne=0;const G=e.getParameter(e.VERSION);G.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(G)[1]),z=ne>=1):G.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),z=ne>=2);let ve=null,Te={};const we=e.getParameter(e.SCISSOR_BOX),Oe=e.getParameter(e.VIEWPORT),it=new ft().fromArray(we),Ye=new ft().fromArray(Oe);function H(v,Q,te,le){const q=new Uint8Array(4),W=e.createTexture();e.bindTexture(v,W),e.texParameteri(v,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(v,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let ue=0;ue<te;ue++)v===e.TEXTURE_3D||v===e.TEXTURE_2D_ARRAY?e.texImage3D(Q,0,e.RGBA,1,1,le,0,e.RGBA,e.UNSIGNED_BYTE,q):e.texImage2D(Q+ue,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,q);return W}const re={};re[e.TEXTURE_2D]=H(e.TEXTURE_2D,e.TEXTURE_2D,1),re[e.TEXTURE_CUBE_MAP]=H(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),re[e.TEXTURE_2D_ARRAY]=H(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),re[e.TEXTURE_3D]=H(e.TEXTURE_3D,e.TEXTURE_3D,1,1),o.setClear(0,0,0,1),h.setClear(1),f.setClear(0),ee(e.DEPTH_TEST),h.setFunc(un),Ge(!1),ge(Ai),ee(e.CULL_FACE),ze(wt);function ee(v){U[v]!==!0&&(e.enable(v),U[v]=!0)}function xe(v){U[v]!==!1&&(e.disable(v),U[v]=!1)}function Ae(v,Q){return E[v]!==Q?(e.bindFramebuffer(v,Q),E[v]=Q,v===e.DRAW_FRAMEBUFFER&&(E[e.FRAMEBUFFER]=Q),v===e.FRAMEBUFFER&&(E[e.DRAW_FRAMEBUFFER]=Q),!0):!1}function Pe(v,Q){let te=R,le=!1;if(v){te=M.get(Q),te===void 0&&(te=[],M.set(Q,te));const q=v.textures;if(te.length!==q.length||te[0]!==e.COLOR_ATTACHMENT0){for(let W=0,ue=q.length;W<ue;W++)te[W]=e.COLOR_ATTACHMENT0+W;te.length=q.length,le=!0}}else te[0]!==e.BACK&&(te[0]=e.BACK,le=!0);le&&e.drawBuffers(te)}function et(v){return F!==v?(e.useProgram(v),F=v,!0):!1}const ye={[zt]:e.FUNC_ADD,[Gr]:e.FUNC_SUBTRACT,[Br]:e.FUNC_REVERSE_SUBTRACT};ye[Qa]=e.MIN,ye[Ja]=e.MAX;const _={[ea]:e.ZERO,[jr]:e.ONE,[Jr]:e.SRC_COLOR,[Qr]:e.SRC_ALPHA,[Zr]:e.SRC_ALPHA_SATURATE,[$r]:e.DST_COLOR,[qr]:e.DST_ALPHA,[Kr]:e.ONE_MINUS_SRC_COLOR,[Yr]:e.ONE_MINUS_SRC_ALPHA,[Xr]:e.ONE_MINUS_DST_COLOR,[zr]:e.ONE_MINUS_DST_ALPHA,[Wr]:e.CONSTANT_COLOR,[kr]:e.ONE_MINUS_CONSTANT_COLOR,[Vr]:e.CONSTANT_ALPHA,[Hr]:e.ONE_MINUS_CONSTANT_ALPHA};function ze(v,Q,te,le,q,W,ue,Le,Xe,He){if(v===wt){L===!0&&(xe(e.BLEND),L=!1);return}if(L===!1&&(ee(e.BLEND),L=!0),v!==Ca){if(v!==l||He!==p){if((r!==zt||m!==zt)&&(e.blendEquation(e.FUNC_ADD),r=zt,m=zt),He)switch(v){case ln:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case bi:e.blendFunc(e.ONE,e.ONE);break;case Ci:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case Ri:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",v);break}else switch(v){case ln:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case bi:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case Ci:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Ri:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",v);break}I=null,A=null,y=null,P=null,N.set(0,0,0),V=0,l=v,p=He}return}q=q||Q,W=W||te,ue=ue||le,(Q!==r||q!==m)&&(e.blendEquationSeparate(ye[Q],ye[q]),r=Q,m=q),(te!==I||le!==A||W!==y||ue!==P)&&(e.blendFuncSeparate(_[te],_[le],_[W],_[ue]),I=te,A=le,y=W,P=ue),(Le.equals(N)===!1||Xe!==V)&&(e.blendColor(Le.r,Le.g,Le.b,Xe),N.copy(Le),V=Xe),l=v,p=!1}function Se(v,Q){v.side===Mt?xe(e.CULL_FACE):ee(e.CULL_FACE);let te=v.side===mt;Q&&(te=!te),Ge(te),v.blending===ln&&v.transparent===!1?ze(wt):ze(v.blending,v.blendEquation,v.blendSrc,v.blendDst,v.blendEquationAlpha,v.blendSrcAlpha,v.blendDstAlpha,v.blendColor,v.blendAlpha,v.premultipliedAlpha),h.setFunc(v.depthFunc),h.setTest(v.depthTest),h.setMask(v.depthWrite),o.setMask(v.colorWrite);const le=v.stencilWrite;f.setTest(le),le&&(f.setMask(v.stencilWriteMask),f.setFunc(v.stencilFunc,v.stencilRef,v.stencilFuncMask),f.setOp(v.stencilFail,v.stencilZFail,v.stencilZPass)),fe(v.polygonOffset,v.polygonOffsetFactor,v.polygonOffsetUnits),v.alphaToCoverage===!0?ee(e.SAMPLE_ALPHA_TO_COVERAGE):xe(e.SAMPLE_ALPHA_TO_COVERAGE)}function Ge(v){d!==v&&(v?e.frontFace(e.CW):e.frontFace(e.CCW),d=v)}function ge(v){v!==Aa?(ee(e.CULL_FACE),v!==g&&(v===Ai?e.cullFace(e.BACK):v===Ra?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):xe(e.CULL_FACE),g=v}function $e(v){v!==Y&&(z&&e.lineWidth(v),Y=v)}function fe(v,Q,te){v?(ee(e.POLYGON_OFFSET_FILL),(X!==Q||k!==te)&&(e.polygonOffset(Q,te),X=Q,k=te)):xe(e.POLYGON_OFFSET_FILL)}function Ie(v){v?ee(e.SCISSOR_TEST):xe(e.SCISSOR_TEST)}function ot(v){v===void 0&&(v=e.TEXTURE0+J-1),ve!==v&&(e.activeTexture(v),ve=v)}function tt(v,Q,te){te===void 0&&(ve===null?te=e.TEXTURE0+J-1:te=ve);let le=Te[te];le===void 0&&(le={type:void 0,texture:void 0},Te[te]=le),(le.type!==v||le.texture!==Q)&&(ve!==te&&(e.activeTexture(te),ve=te),e.bindTexture(v,Q||re[v]),le.type=v,le.texture=Q)}function u(){const v=Te[ve];v!==void 0&&v.type!==void 0&&(e.bindTexture(v.type,null),v.type=void 0,v.texture=void 0)}function a(){try{e.compressedTexImage2D(...arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function C(){try{e.compressedTexImage3D(...arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function B(){try{e.texSubImage2D(...arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function K(){try{e.texSubImage3D(...arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function O(){try{e.compressedTexSubImage2D(...arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function me(){try{e.compressedTexSubImage3D(...arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function j(){try{e.texStorage2D(...arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function pe(){try{e.texStorage3D(...arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function he(){try{e.texImage2D(...arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function Z(){try{e.texImage3D(...arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function se(v){it.equals(v)===!1&&(e.scissor(v.x,v.y,v.z,v.w),it.copy(v))}function Ce(v){Ye.equals(v)===!1&&(e.viewport(v.x,v.y,v.z,v.w),Ye.copy(v))}function _e(v,Q){let te=x.get(Q);te===void 0&&(te=new WeakMap,x.set(Q,te));let le=te.get(v);le===void 0&&(le=e.getUniformBlockIndex(Q,v.name),te.set(v,le))}function ae(v,Q){const le=x.get(Q).get(v);b.get(Q)!==le&&(e.uniformBlockBinding(Q,le,v.__bindingPointIndex),b.set(Q,le))}function Ue(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),h.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),U={},ve=null,Te={},E={},M=new WeakMap,R=[],F=null,L=!1,l=null,r=null,I=null,A=null,m=null,y=null,P=null,N=new Ze(0,0,0),V=0,p=!1,d=null,g=null,Y=null,X=null,k=null,it.set(0,0,e.canvas.width,e.canvas.height),Ye.set(0,0,e.canvas.width,e.canvas.height),o.reset(),h.reset(),f.reset()}return{buffers:{color:o,depth:h,stencil:f},enable:ee,disable:xe,bindFramebuffer:Ae,drawBuffers:Pe,useProgram:et,setBlending:ze,setMaterial:Se,setFlipSided:Ge,setCullFace:ge,setLineWidth:$e,setPolygonOffset:fe,setScissorTest:Ie,activeTexture:ot,bindTexture:tt,unbindTexture:u,compressedTexImage2D:a,compressedTexImage3D:C,texImage2D:he,texImage3D:Z,updateUBOMapping:_e,uniformBlockBinding:ae,texStorage2D:j,texStorage3D:pe,texSubImage2D:B,texSubImage3D:K,compressedTexSubImage2D:O,compressedTexSubImage3D:me,scissor:se,viewport:Ce,reset:Ue}}function bf(e,n,t,i,c,o,h){const f=n.has("WEBGL_multisampled_render_to_texture")?n.get("WEBGL_multisampled_render_to_texture"):null,b=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),x=new dt,U=new WeakMap;let E;const M=new WeakMap;let R=!1;try{R=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function F(u,a){return R?new OffscreenCanvas(u,a):Ka("canvas")}function L(u,a,C){let B=1;const K=tt(u);if((K.width>C||K.height>C)&&(B=C/Math.max(K.width,K.height)),B<1)if(typeof HTMLImageElement<"u"&&u instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&u instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&u instanceof ImageBitmap||typeof VideoFrame<"u"&&u instanceof VideoFrame){const O=Math.floor(B*K.width),me=Math.floor(B*K.height);E===void 0&&(E=F(O,me));const j=a?F(O,me):E;return j.width=O,j.height=me,j.getContext("2d").drawImage(u,0,0,O,me),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+O+"x"+me+")."),j}else return"data"in u&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),u;return u}function l(u){return u.generateMipmaps}function r(u){e.generateMipmap(u)}function I(u){return u.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:u.isWebGL3DRenderTarget?e.TEXTURE_3D:u.isWebGLArrayRenderTarget||u.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function A(u,a,C,B,K=!1){if(u!==null){if(e[u]!==void 0)return e[u];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+u+"'")}let O=a;if(a===e.RED&&(C===e.FLOAT&&(O=e.R32F),C===e.HALF_FLOAT&&(O=e.R16F),C===e.UNSIGNED_BYTE&&(O=e.R8)),a===e.RED_INTEGER&&(C===e.UNSIGNED_BYTE&&(O=e.R8UI),C===e.UNSIGNED_SHORT&&(O=e.R16UI),C===e.UNSIGNED_INT&&(O=e.R32UI),C===e.BYTE&&(O=e.R8I),C===e.SHORT&&(O=e.R16I),C===e.INT&&(O=e.R32I)),a===e.RG&&(C===e.FLOAT&&(O=e.RG32F),C===e.HALF_FLOAT&&(O=e.RG16F),C===e.UNSIGNED_BYTE&&(O=e.RG8)),a===e.RG_INTEGER&&(C===e.UNSIGNED_BYTE&&(O=e.RG8UI),C===e.UNSIGNED_SHORT&&(O=e.RG16UI),C===e.UNSIGNED_INT&&(O=e.RG32UI),C===e.BYTE&&(O=e.RG8I),C===e.SHORT&&(O=e.RG16I),C===e.INT&&(O=e.RG32I)),a===e.RGB_INTEGER&&(C===e.UNSIGNED_BYTE&&(O=e.RGB8UI),C===e.UNSIGNED_SHORT&&(O=e.RGB16UI),C===e.UNSIGNED_INT&&(O=e.RGB32UI),C===e.BYTE&&(O=e.RGB8I),C===e.SHORT&&(O=e.RGB16I),C===e.INT&&(O=e.RGB32I)),a===e.RGBA_INTEGER&&(C===e.UNSIGNED_BYTE&&(O=e.RGBA8UI),C===e.UNSIGNED_SHORT&&(O=e.RGBA16UI),C===e.UNSIGNED_INT&&(O=e.RGBA32UI),C===e.BYTE&&(O=e.RGBA8I),C===e.SHORT&&(O=e.RGBA16I),C===e.INT&&(O=e.RGBA32I)),a===e.RGB&&C===e.UNSIGNED_INT_5_9_9_9_REV&&(O=e.RGB9_E5),a===e.RGBA){const me=K?gr:nt.getTransfer(B);C===e.FLOAT&&(O=e.RGBA32F),C===e.HALF_FLOAT&&(O=e.RGBA16F),C===e.UNSIGNED_BYTE&&(O=me===qe?e.SRGB8_ALPHA8:e.RGBA8),C===e.UNSIGNED_SHORT_4_4_4_4&&(O=e.RGBA4),C===e.UNSIGNED_SHORT_5_5_5_1&&(O=e.RGB5_A1)}return(O===e.R16F||O===e.R32F||O===e.RG16F||O===e.RG32F||O===e.RGBA16F||O===e.RGBA32F)&&n.get("EXT_color_buffer_float"),O}function m(u,a){let C;return u?a===null||a===Qt||a===Zt?C=e.DEPTH24_STENCIL8:a===Dt?C=e.DEPTH32F_STENCIL8:a===pn&&(C=e.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):a===null||a===Qt||a===Zt?C=e.DEPTH_COMPONENT24:a===Dt?C=e.DEPTH_COMPONENT32F:a===pn&&(C=e.DEPTH_COMPONENT16),C}function y(u,a){return l(u)===!0||u.isFramebufferTexture&&u.minFilter!==Kt&&u.minFilter!==Bt?Math.log2(Math.max(a.width,a.height))+1:u.mipmaps!==void 0&&u.mipmaps.length>0?u.mipmaps.length:u.isCompressedTexture&&Array.isArray(u.image)?a.mipmaps.length:1}function P(u){const a=u.target;a.removeEventListener("dispose",P),V(a),a.isVideoTexture&&U.delete(a)}function N(u){const a=u.target;a.removeEventListener("dispose",N),d(a)}function V(u){const a=i.get(u);if(a.__webglInit===void 0)return;const C=u.source,B=M.get(C);if(B){const K=B[a.__cacheKey];K.usedTimes--,K.usedTimes===0&&p(u),Object.keys(B).length===0&&M.delete(C)}i.remove(u)}function p(u){const a=i.get(u);e.deleteTexture(a.__webglTexture);const C=u.source,B=M.get(C);delete B[a.__cacheKey],h.memory.textures--}function d(u){const a=i.get(u);if(u.depthTexture&&(u.depthTexture.dispose(),i.remove(u.depthTexture)),u.isWebGLCubeRenderTarget)for(let B=0;B<6;B++){if(Array.isArray(a.__webglFramebuffer[B]))for(let K=0;K<a.__webglFramebuffer[B].length;K++)e.deleteFramebuffer(a.__webglFramebuffer[B][K]);else e.deleteFramebuffer(a.__webglFramebuffer[B]);a.__webglDepthbuffer&&e.deleteRenderbuffer(a.__webglDepthbuffer[B])}else{if(Array.isArray(a.__webglFramebuffer))for(let B=0;B<a.__webglFramebuffer.length;B++)e.deleteFramebuffer(a.__webglFramebuffer[B]);else e.deleteFramebuffer(a.__webglFramebuffer);if(a.__webglDepthbuffer&&e.deleteRenderbuffer(a.__webglDepthbuffer),a.__webglMultisampledFramebuffer&&e.deleteFramebuffer(a.__webglMultisampledFramebuffer),a.__webglColorRenderbuffer)for(let B=0;B<a.__webglColorRenderbuffer.length;B++)a.__webglColorRenderbuffer[B]&&e.deleteRenderbuffer(a.__webglColorRenderbuffer[B]);a.__webglDepthRenderbuffer&&e.deleteRenderbuffer(a.__webglDepthRenderbuffer)}const C=u.textures;for(let B=0,K=C.length;B<K;B++){const O=i.get(C[B]);O.__webglTexture&&(e.deleteTexture(O.__webglTexture),h.memory.textures--),i.remove(C[B])}i.remove(u)}let g=0;function Y(){g=0}function X(){const u=g;return u>=c.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+u+" texture units while this GPU supports only "+c.maxTextures),g+=1,u}function k(u){const a=[];return a.push(u.wrapS),a.push(u.wrapT),a.push(u.wrapR||0),a.push(u.magFilter),a.push(u.minFilter),a.push(u.anisotropy),a.push(u.internalFormat),a.push(u.format),a.push(u.type),a.push(u.generateMipmaps),a.push(u.premultiplyAlpha),a.push(u.flipY),a.push(u.unpackAlignment),a.push(u.colorSpace),a.join()}function J(u,a){const C=i.get(u);if(u.isVideoTexture&&Ie(u),u.isRenderTargetTexture===!1&&u.isExternalTexture!==!0&&u.version>0&&C.__version!==u.version){const B=u.image;if(B===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(B.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{re(C,u,a);return}}else u.isExternalTexture&&(C.__webglTexture=u.sourceTexture?u.sourceTexture:null);t.bindTexture(e.TEXTURE_2D,C.__webglTexture,e.TEXTURE0+a)}function z(u,a){const C=i.get(u);if(u.isRenderTargetTexture===!1&&u.version>0&&C.__version!==u.version){re(C,u,a);return}t.bindTexture(e.TEXTURE_2D_ARRAY,C.__webglTexture,e.TEXTURE0+a)}function ne(u,a){const C=i.get(u);if(u.isRenderTargetTexture===!1&&u.version>0&&C.__version!==u.version){re(C,u,a);return}t.bindTexture(e.TEXTURE_3D,C.__webglTexture,e.TEXTURE0+a)}function G(u,a){const C=i.get(u);if(u.version>0&&C.__version!==u.version){ee(C,u,a);return}t.bindTexture(e.TEXTURE_CUBE_MAP,C.__webglTexture,e.TEXTURE0+a)}const ve={[ia]:e.REPEAT,[na]:e.CLAMP_TO_EDGE,[ta]:e.MIRRORED_REPEAT},Te={[Kt]:e.NEAREST,[ra]:e.NEAREST_MIPMAP_NEAREST,[tn]:e.NEAREST_MIPMAP_LINEAR,[Bt]:e.LINEAR,[Mn]:e.LINEAR_MIPMAP_NEAREST,[Xt]:e.LINEAR_MIPMAP_LINEAR},we={[da]:e.NEVER,[fa]:e.ALWAYS,[la]:e.LESS,[ir]:e.LEQUAL,[ca]:e.EQUAL,[sa]:e.GEQUAL,[oa]:e.GREATER,[aa]:e.NOTEQUAL};function Oe(u,a){if(a.type===Dt&&n.has("OES_texture_float_linear")===!1&&(a.magFilter===Bt||a.magFilter===Mn||a.magFilter===tn||a.magFilter===Xt||a.minFilter===Bt||a.minFilter===Mn||a.minFilter===tn||a.minFilter===Xt)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(u,e.TEXTURE_WRAP_S,ve[a.wrapS]),e.texParameteri(u,e.TEXTURE_WRAP_T,ve[a.wrapT]),(u===e.TEXTURE_3D||u===e.TEXTURE_2D_ARRAY)&&e.texParameteri(u,e.TEXTURE_WRAP_R,ve[a.wrapR]),e.texParameteri(u,e.TEXTURE_MAG_FILTER,Te[a.magFilter]),e.texParameteri(u,e.TEXTURE_MIN_FILTER,Te[a.minFilter]),a.compareFunction&&(e.texParameteri(u,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(u,e.TEXTURE_COMPARE_FUNC,we[a.compareFunction])),n.has("EXT_texture_filter_anisotropic")===!0){if(a.magFilter===Kt||a.minFilter!==tn&&a.minFilter!==Xt||a.type===Dt&&n.has("OES_texture_float_linear")===!1)return;if(a.anisotropy>1||i.get(a).__currentAnisotropy){const C=n.get("EXT_texture_filter_anisotropic");e.texParameterf(u,C.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,c.getMaxAnisotropy())),i.get(a).__currentAnisotropy=a.anisotropy}}}function it(u,a){let C=!1;u.__webglInit===void 0&&(u.__webglInit=!0,a.addEventListener("dispose",P));const B=a.source;let K=M.get(B);K===void 0&&(K={},M.set(B,K));const O=k(a);if(O!==u.__cacheKey){K[O]===void 0&&(K[O]={texture:e.createTexture(),usedTimes:0},h.memory.textures++,C=!0),K[O].usedTimes++;const me=K[u.__cacheKey];me!==void 0&&(K[u.__cacheKey].usedTimes--,me.usedTimes===0&&p(a)),u.__cacheKey=O,u.__webglTexture=K[O].texture}return C}function Ye(u,a,C){return Math.floor(Math.floor(u/C)/a)}function H(u,a,C,B){const O=u.updateRanges;if(O.length===0)t.texSubImage2D(e.TEXTURE_2D,0,0,0,a.width,a.height,C,B,a.data);else{O.sort((Z,se)=>Z.start-se.start);let me=0;for(let Z=1;Z<O.length;Z++){const se=O[me],Ce=O[Z],_e=se.start+se.count,ae=Ye(Ce.start,a.width,4),Ue=Ye(se.start,a.width,4);Ce.start<=_e+1&&ae===Ue&&Ye(Ce.start+Ce.count-1,a.width,4)===ae?se.count=Math.max(se.count,Ce.start+Ce.count-se.start):(++me,O[me]=Ce)}O.length=me+1;const j=e.getParameter(e.UNPACK_ROW_LENGTH),pe=e.getParameter(e.UNPACK_SKIP_PIXELS),he=e.getParameter(e.UNPACK_SKIP_ROWS);e.pixelStorei(e.UNPACK_ROW_LENGTH,a.width);for(let Z=0,se=O.length;Z<se;Z++){const Ce=O[Z],_e=Math.floor(Ce.start/4),ae=Math.ceil(Ce.count/4),Ue=_e%a.width,v=Math.floor(_e/a.width),Q=ae,te=1;e.pixelStorei(e.UNPACK_SKIP_PIXELS,Ue),e.pixelStorei(e.UNPACK_SKIP_ROWS,v),t.texSubImage2D(e.TEXTURE_2D,0,Ue,v,Q,te,C,B,a.data)}u.clearUpdateRanges(),e.pixelStorei(e.UNPACK_ROW_LENGTH,j),e.pixelStorei(e.UNPACK_SKIP_PIXELS,pe),e.pixelStorei(e.UNPACK_SKIP_ROWS,he)}}function re(u,a,C){let B=e.TEXTURE_2D;(a.isDataArrayTexture||a.isCompressedArrayTexture)&&(B=e.TEXTURE_2D_ARRAY),a.isData3DTexture&&(B=e.TEXTURE_3D);const K=it(u,a),O=a.source;t.bindTexture(B,u.__webglTexture,e.TEXTURE0+C);const me=i.get(O);if(O.version!==me.__version||K===!0){t.activeTexture(e.TEXTURE0+C);const j=nt.getPrimaries(nt.workingColorSpace),pe=a.colorSpace===Ft?null:nt.getPrimaries(a.colorSpace),he=a.colorSpace===Ft||j===pe?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,a.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,a.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,a.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,he);let Z=L(a.image,!1,c.maxTextureSize);Z=ot(a,Z);const se=o.convert(a.format,a.colorSpace),Ce=o.convert(a.type);let _e=A(a.internalFormat,se,Ce,a.colorSpace,a.isVideoTexture);Oe(B,a);let ae;const Ue=a.mipmaps,v=a.isVideoTexture!==!0,Q=me.__version===void 0||K===!0,te=O.dataReady,le=y(a,Z);if(a.isDepthTexture)_e=m(a.format===dn,a.type),Q&&(v?t.texStorage2D(e.TEXTURE_2D,1,_e,Z.width,Z.height):t.texImage2D(e.TEXTURE_2D,0,_e,Z.width,Z.height,0,se,Ce,null));else if(a.isDataTexture)if(Ue.length>0){v&&Q&&t.texStorage2D(e.TEXTURE_2D,le,_e,Ue[0].width,Ue[0].height);for(let q=0,W=Ue.length;q<W;q++)ae=Ue[q],v?te&&t.texSubImage2D(e.TEXTURE_2D,q,0,0,ae.width,ae.height,se,Ce,ae.data):t.texImage2D(e.TEXTURE_2D,q,_e,ae.width,ae.height,0,se,Ce,ae.data);a.generateMipmaps=!1}else v?(Q&&t.texStorage2D(e.TEXTURE_2D,le,_e,Z.width,Z.height),te&&H(a,Z,se,Ce)):t.texImage2D(e.TEXTURE_2D,0,_e,Z.width,Z.height,0,se,Ce,Z.data);else if(a.isCompressedTexture)if(a.isCompressedArrayTexture){v&&Q&&t.texStorage3D(e.TEXTURE_2D_ARRAY,le,_e,Ue[0].width,Ue[0].height,Z.depth);for(let q=0,W=Ue.length;q<W;q++)if(ae=Ue[q],a.format!==Tt)if(se!==null)if(v){if(te)if(a.layerUpdates.size>0){const ue=Li(ae.width,ae.height,a.format,a.type);for(const Le of a.layerUpdates){const Xe=ae.data.subarray(Le*ue/ae.data.BYTES_PER_ELEMENT,(Le+1)*ue/ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,q,0,0,Le,ae.width,ae.height,1,se,Xe)}a.clearLayerUpdates()}else t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,q,0,0,0,ae.width,ae.height,Z.depth,se,ae.data)}else t.compressedTexImage3D(e.TEXTURE_2D_ARRAY,q,_e,ae.width,ae.height,Z.depth,0,ae.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else v?te&&t.texSubImage3D(e.TEXTURE_2D_ARRAY,q,0,0,0,ae.width,ae.height,Z.depth,se,Ce,ae.data):t.texImage3D(e.TEXTURE_2D_ARRAY,q,_e,ae.width,ae.height,Z.depth,0,se,Ce,ae.data)}else{v&&Q&&t.texStorage2D(e.TEXTURE_2D,le,_e,Ue[0].width,Ue[0].height);for(let q=0,W=Ue.length;q<W;q++)ae=Ue[q],a.format!==Tt?se!==null?v?te&&t.compressedTexSubImage2D(e.TEXTURE_2D,q,0,0,ae.width,ae.height,se,ae.data):t.compressedTexImage2D(e.TEXTURE_2D,q,_e,ae.width,ae.height,0,ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):v?te&&t.texSubImage2D(e.TEXTURE_2D,q,0,0,ae.width,ae.height,se,Ce,ae.data):t.texImage2D(e.TEXTURE_2D,q,_e,ae.width,ae.height,0,se,Ce,ae.data)}else if(a.isDataArrayTexture)if(v){if(Q&&t.texStorage3D(e.TEXTURE_2D_ARRAY,le,_e,Z.width,Z.height,Z.depth),te)if(a.layerUpdates.size>0){const q=Li(Z.width,Z.height,a.format,a.type);for(const W of a.layerUpdates){const ue=Z.data.subarray(W*q/Z.data.BYTES_PER_ELEMENT,(W+1)*q/Z.data.BYTES_PER_ELEMENT);t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,W,Z.width,Z.height,1,se,Ce,ue)}a.clearLayerUpdates()}else t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,se,Ce,Z.data)}else t.texImage3D(e.TEXTURE_2D_ARRAY,0,_e,Z.width,Z.height,Z.depth,0,se,Ce,Z.data);else if(a.isData3DTexture)v?(Q&&t.texStorage3D(e.TEXTURE_3D,le,_e,Z.width,Z.height,Z.depth),te&&t.texSubImage3D(e.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,se,Ce,Z.data)):t.texImage3D(e.TEXTURE_3D,0,_e,Z.width,Z.height,Z.depth,0,se,Ce,Z.data);else if(a.isFramebufferTexture){if(Q)if(v)t.texStorage2D(e.TEXTURE_2D,le,_e,Z.width,Z.height);else{let q=Z.width,W=Z.height;for(let ue=0;ue<le;ue++)t.texImage2D(e.TEXTURE_2D,ue,_e,q,W,0,se,Ce,null),q>>=1,W>>=1}}else if(Ue.length>0){if(v&&Q){const q=tt(Ue[0]);t.texStorage2D(e.TEXTURE_2D,le,_e,q.width,q.height)}for(let q=0,W=Ue.length;q<W;q++)ae=Ue[q],v?te&&t.texSubImage2D(e.TEXTURE_2D,q,0,0,se,Ce,ae):t.texImage2D(e.TEXTURE_2D,q,_e,se,Ce,ae);a.generateMipmaps=!1}else if(v){if(Q){const q=tt(Z);t.texStorage2D(e.TEXTURE_2D,le,_e,q.width,q.height)}te&&t.texSubImage2D(e.TEXTURE_2D,0,0,0,se,Ce,Z)}else t.texImage2D(e.TEXTURE_2D,0,_e,se,Ce,Z);l(a)&&r(B),me.__version=O.version,a.onUpdate&&a.onUpdate(a)}u.__version=a.version}function ee(u,a,C){if(a.image.length!==6)return;const B=it(u,a),K=a.source;t.bindTexture(e.TEXTURE_CUBE_MAP,u.__webglTexture,e.TEXTURE0+C);const O=i.get(K);if(K.version!==O.__version||B===!0){t.activeTexture(e.TEXTURE0+C);const me=nt.getPrimaries(nt.workingColorSpace),j=a.colorSpace===Ft?null:nt.getPrimaries(a.colorSpace),pe=a.colorSpace===Ft||me===j?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,a.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,a.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,a.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe);const he=a.isCompressedTexture||a.image[0].isCompressedTexture,Z=a.image[0]&&a.image[0].isDataTexture,se=[];for(let W=0;W<6;W++)!he&&!Z?se[W]=L(a.image[W],!0,c.maxCubemapSize):se[W]=Z?a.image[W].image:a.image[W],se[W]=ot(a,se[W]);const Ce=se[0],_e=o.convert(a.format,a.colorSpace),ae=o.convert(a.type),Ue=A(a.internalFormat,_e,ae,a.colorSpace),v=a.isVideoTexture!==!0,Q=O.__version===void 0||B===!0,te=K.dataReady;let le=y(a,Ce);Oe(e.TEXTURE_CUBE_MAP,a);let q;if(he){v&&Q&&t.texStorage2D(e.TEXTURE_CUBE_MAP,le,Ue,Ce.width,Ce.height);for(let W=0;W<6;W++){q=se[W].mipmaps;for(let ue=0;ue<q.length;ue++){const Le=q[ue];a.format!==Tt?_e!==null?v?te&&t.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+W,ue,0,0,Le.width,Le.height,_e,Le.data):t.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+W,ue,Ue,Le.width,Le.height,0,Le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):v?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+W,ue,0,0,Le.width,Le.height,_e,ae,Le.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+W,ue,Ue,Le.width,Le.height,0,_e,ae,Le.data)}}}else{if(q=a.mipmaps,v&&Q){q.length>0&&le++;const W=tt(se[0]);t.texStorage2D(e.TEXTURE_CUBE_MAP,le,Ue,W.width,W.height)}for(let W=0;W<6;W++)if(Z){v?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+W,0,0,0,se[W].width,se[W].height,_e,ae,se[W].data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+W,0,Ue,se[W].width,se[W].height,0,_e,ae,se[W].data);for(let ue=0;ue<q.length;ue++){const Xe=q[ue].image[W].image;v?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+W,ue+1,0,0,Xe.width,Xe.height,_e,ae,Xe.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+W,ue+1,Ue,Xe.width,Xe.height,0,_e,ae,Xe.data)}}else{v?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+W,0,0,0,_e,ae,se[W]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+W,0,Ue,_e,ae,se[W]);for(let ue=0;ue<q.length;ue++){const Le=q[ue];v?te&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+W,ue+1,0,0,_e,ae,Le.image[W]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+W,ue+1,Ue,_e,ae,Le.image[W])}}}l(a)&&r(e.TEXTURE_CUBE_MAP),O.__version=K.version,a.onUpdate&&a.onUpdate(a)}u.__version=a.version}function xe(u,a,C,B,K,O){const me=o.convert(C.format,C.colorSpace),j=o.convert(C.type),pe=A(C.internalFormat,me,j,C.colorSpace),he=i.get(a),Z=i.get(C);if(Z.__renderTarget=a,!he.__hasExternalTextures){const se=Math.max(1,a.width>>O),Ce=Math.max(1,a.height>>O);K===e.TEXTURE_3D||K===e.TEXTURE_2D_ARRAY?t.texImage3D(K,O,pe,se,Ce,a.depth,0,me,j,null):t.texImage2D(K,O,pe,se,Ce,0,me,j,null)}t.bindFramebuffer(e.FRAMEBUFFER,u),fe(a)?f.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,B,K,Z.__webglTexture,0,$e(a)):(K===e.TEXTURE_2D||K>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,B,K,Z.__webglTexture,O),t.bindFramebuffer(e.FRAMEBUFFER,null)}function Ae(u,a,C){if(e.bindRenderbuffer(e.RENDERBUFFER,u),a.depthBuffer){const B=a.depthTexture,K=B&&B.isDepthTexture?B.type:null,O=m(a.stencilBuffer,K),me=a.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,j=$e(a);fe(a)?f.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,j,O,a.width,a.height):C?e.renderbufferStorageMultisample(e.RENDERBUFFER,j,O,a.width,a.height):e.renderbufferStorage(e.RENDERBUFFER,O,a.width,a.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,me,e.RENDERBUFFER,u)}else{const B=a.textures;for(let K=0;K<B.length;K++){const O=B[K],me=o.convert(O.format,O.colorSpace),j=o.convert(O.type),pe=A(O.internalFormat,me,j,O.colorSpace),he=$e(a);C&&fe(a)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,he,pe,a.width,a.height):fe(a)?f.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,he,pe,a.width,a.height):e.renderbufferStorage(e.RENDERBUFFER,pe,a.width,a.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Pe(u,a){if(a&&a.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(e.FRAMEBUFFER,u),!(a.depthTexture&&a.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const B=i.get(a.depthTexture);B.__renderTarget=a,(!B.__webglTexture||a.depthTexture.image.width!==a.width||a.depthTexture.image.height!==a.height)&&(a.depthTexture.image.width=a.width,a.depthTexture.image.height=a.height,a.depthTexture.needsUpdate=!0),J(a.depthTexture,0);const K=B.__webglTexture,O=$e(a);if(a.depthTexture.format===Wn)fe(a)?f.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,K,0,O):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,K,0);else if(a.depthTexture.format===dn)fe(a)?f.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,K,0,O):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,K,0);else throw new Error("Unknown depthTexture format")}function et(u){const a=i.get(u),C=u.isWebGLCubeRenderTarget===!0;if(a.__boundDepthTexture!==u.depthTexture){const B=u.depthTexture;if(a.__depthDisposeCallback&&a.__depthDisposeCallback(),B){const K=()=>{delete a.__boundDepthTexture,delete a.__depthDisposeCallback,B.removeEventListener("dispose",K)};B.addEventListener("dispose",K),a.__depthDisposeCallback=K}a.__boundDepthTexture=B}if(u.depthTexture&&!a.__autoAllocateDepthBuffer){if(C)throw new Error("target.depthTexture not supported in Cube render targets");const B=u.texture.mipmaps;B&&B.length>0?Pe(a.__webglFramebuffer[0],u):Pe(a.__webglFramebuffer,u)}else if(C){a.__webglDepthbuffer=[];for(let B=0;B<6;B++)if(t.bindFramebuffer(e.FRAMEBUFFER,a.__webglFramebuffer[B]),a.__webglDepthbuffer[B]===void 0)a.__webglDepthbuffer[B]=e.createRenderbuffer(),Ae(a.__webglDepthbuffer[B],u,!1);else{const K=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,O=a.__webglDepthbuffer[B];e.bindRenderbuffer(e.RENDERBUFFER,O),e.framebufferRenderbuffer(e.FRAMEBUFFER,K,e.RENDERBUFFER,O)}}else{const B=u.texture.mipmaps;if(B&&B.length>0?t.bindFramebuffer(e.FRAMEBUFFER,a.__webglFramebuffer[0]):t.bindFramebuffer(e.FRAMEBUFFER,a.__webglFramebuffer),a.__webglDepthbuffer===void 0)a.__webglDepthbuffer=e.createRenderbuffer(),Ae(a.__webglDepthbuffer,u,!1);else{const K=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,O=a.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,O),e.framebufferRenderbuffer(e.FRAMEBUFFER,K,e.RENDERBUFFER,O)}}t.bindFramebuffer(e.FRAMEBUFFER,null)}function ye(u,a,C){const B=i.get(u);a!==void 0&&xe(B.__webglFramebuffer,u,u.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),C!==void 0&&et(u)}function _(u){const a=u.texture,C=i.get(u),B=i.get(a);u.addEventListener("dispose",N);const K=u.textures,O=u.isWebGLCubeRenderTarget===!0,me=K.length>1;if(me||(B.__webglTexture===void 0&&(B.__webglTexture=e.createTexture()),B.__version=a.version,h.memory.textures++),O){C.__webglFramebuffer=[];for(let j=0;j<6;j++)if(a.mipmaps&&a.mipmaps.length>0){C.__webglFramebuffer[j]=[];for(let pe=0;pe<a.mipmaps.length;pe++)C.__webglFramebuffer[j][pe]=e.createFramebuffer()}else C.__webglFramebuffer[j]=e.createFramebuffer()}else{if(a.mipmaps&&a.mipmaps.length>0){C.__webglFramebuffer=[];for(let j=0;j<a.mipmaps.length;j++)C.__webglFramebuffer[j]=e.createFramebuffer()}else C.__webglFramebuffer=e.createFramebuffer();if(me)for(let j=0,pe=K.length;j<pe;j++){const he=i.get(K[j]);he.__webglTexture===void 0&&(he.__webglTexture=e.createTexture(),h.memory.textures++)}if(u.samples>0&&fe(u)===!1){C.__webglMultisampledFramebuffer=e.createFramebuffer(),C.__webglColorRenderbuffer=[],t.bindFramebuffer(e.FRAMEBUFFER,C.__webglMultisampledFramebuffer);for(let j=0;j<K.length;j++){const pe=K[j];C.__webglColorRenderbuffer[j]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,C.__webglColorRenderbuffer[j]);const he=o.convert(pe.format,pe.colorSpace),Z=o.convert(pe.type),se=A(pe.internalFormat,he,Z,pe.colorSpace,u.isXRRenderTarget===!0),Ce=$e(u);e.renderbufferStorageMultisample(e.RENDERBUFFER,Ce,se,u.width,u.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+j,e.RENDERBUFFER,C.__webglColorRenderbuffer[j])}e.bindRenderbuffer(e.RENDERBUFFER,null),u.depthBuffer&&(C.__webglDepthRenderbuffer=e.createRenderbuffer(),Ae(C.__webglDepthRenderbuffer,u,!0)),t.bindFramebuffer(e.FRAMEBUFFER,null)}}if(O){t.bindTexture(e.TEXTURE_CUBE_MAP,B.__webglTexture),Oe(e.TEXTURE_CUBE_MAP,a);for(let j=0;j<6;j++)if(a.mipmaps&&a.mipmaps.length>0)for(let pe=0;pe<a.mipmaps.length;pe++)xe(C.__webglFramebuffer[j][pe],u,a,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+j,pe);else xe(C.__webglFramebuffer[j],u,a,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);l(a)&&r(e.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(me){for(let j=0,pe=K.length;j<pe;j++){const he=K[j],Z=i.get(he);let se=e.TEXTURE_2D;(u.isWebGL3DRenderTarget||u.isWebGLArrayRenderTarget)&&(se=u.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(se,Z.__webglTexture),Oe(se,he),xe(C.__webglFramebuffer,u,he,e.COLOR_ATTACHMENT0+j,se,0),l(he)&&r(se)}t.unbindTexture()}else{let j=e.TEXTURE_2D;if((u.isWebGL3DRenderTarget||u.isWebGLArrayRenderTarget)&&(j=u.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(j,B.__webglTexture),Oe(j,a),a.mipmaps&&a.mipmaps.length>0)for(let pe=0;pe<a.mipmaps.length;pe++)xe(C.__webglFramebuffer[pe],u,a,e.COLOR_ATTACHMENT0,j,pe);else xe(C.__webglFramebuffer,u,a,e.COLOR_ATTACHMENT0,j,0);l(a)&&r(j),t.unbindTexture()}u.depthBuffer&&et(u)}function ze(u){const a=u.textures;for(let C=0,B=a.length;C<B;C++){const K=a[C];if(l(K)){const O=I(u),me=i.get(K).__webglTexture;t.bindTexture(O,me),r(O),t.unbindTexture()}}}const Se=[],Ge=[];function ge(u){if(u.samples>0){if(fe(u)===!1){const a=u.textures,C=u.width,B=u.height;let K=e.COLOR_BUFFER_BIT;const O=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,me=i.get(u),j=a.length>1;if(j)for(let he=0;he<a.length;he++)t.bindFramebuffer(e.FRAMEBUFFER,me.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+he,e.RENDERBUFFER,null),t.bindFramebuffer(e.FRAMEBUFFER,me.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+he,e.TEXTURE_2D,null,0);t.bindFramebuffer(e.READ_FRAMEBUFFER,me.__webglMultisampledFramebuffer);const pe=u.texture.mipmaps;pe&&pe.length>0?t.bindFramebuffer(e.DRAW_FRAMEBUFFER,me.__webglFramebuffer[0]):t.bindFramebuffer(e.DRAW_FRAMEBUFFER,me.__webglFramebuffer);for(let he=0;he<a.length;he++){if(u.resolveDepthBuffer&&(u.depthBuffer&&(K|=e.DEPTH_BUFFER_BIT),u.stencilBuffer&&u.resolveStencilBuffer&&(K|=e.STENCIL_BUFFER_BIT)),j){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,me.__webglColorRenderbuffer[he]);const Z=i.get(a[he]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,Z,0)}e.blitFramebuffer(0,0,C,B,0,0,C,B,K,e.NEAREST),b===!0&&(Se.length=0,Ge.length=0,Se.push(e.COLOR_ATTACHMENT0+he),u.depthBuffer&&u.resolveDepthBuffer===!1&&(Se.push(O),Ge.push(O),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Ge)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Se))}if(t.bindFramebuffer(e.READ_FRAMEBUFFER,null),t.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),j)for(let he=0;he<a.length;he++){t.bindFramebuffer(e.FRAMEBUFFER,me.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+he,e.RENDERBUFFER,me.__webglColorRenderbuffer[he]);const Z=i.get(a[he]).__webglTexture;t.bindFramebuffer(e.FRAMEBUFFER,me.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+he,e.TEXTURE_2D,Z,0)}t.bindFramebuffer(e.DRAW_FRAMEBUFFER,me.__webglMultisampledFramebuffer)}else if(u.depthBuffer&&u.resolveDepthBuffer===!1&&b){const a=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[a])}}}function $e(u){return Math.min(c.maxSamples,u.samples)}function fe(u){const a=i.get(u);return u.samples>0&&n.has("WEBGL_multisampled_render_to_texture")===!0&&a.__useRenderToTexture!==!1}function Ie(u){const a=h.render.frame;U.get(u)!==a&&(U.set(u,a),u.update())}function ot(u,a){const C=u.colorSpace,B=u.format,K=u.type;return u.isCompressedTexture===!0||u.isVideoTexture===!0||C!==_n&&C!==Ft&&(nt.getTransfer(C)===qe?(B!==Tt||K!==It)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",C)),a}function tt(u){return typeof HTMLImageElement<"u"&&u instanceof HTMLImageElement?(x.width=u.naturalWidth||u.width,x.height=u.naturalHeight||u.height):typeof VideoFrame<"u"&&u instanceof VideoFrame?(x.width=u.displayWidth,x.height=u.displayHeight):(x.width=u.width,x.height=u.height),x}this.allocateTextureUnit=X,this.resetTextureUnits=Y,this.setTexture2D=J,this.setTexture2DArray=z,this.setTexture3D=ne,this.setTextureCube=G,this.rebindTextures=ye,this.setupRenderTarget=_,this.updateRenderTargetMipmap=ze,this.updateMultisampleRenderTarget=ge,this.setupDepthRenderbuffer=et,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=fe}function Pf(e,n){function t(i,c=Ft){let o;const h=nt.getTransfer(c);if(i===It)return e.UNSIGNED_BYTE;if(i===or)return e.UNSIGNED_SHORT_4_4_4_4;if(i===sr)return e.UNSIGNED_SHORT_5_5_5_1;if(i===ma)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===va)return e.BYTE;if(i===ga)return e.SHORT;if(i===pn)return e.UNSIGNED_SHORT;if(i===lr)return e.INT;if(i===Qt)return e.UNSIGNED_INT;if(i===Dt)return e.FLOAT;if(i===hn)return e.HALF_FLOAT;if(i===Ea)return e.ALPHA;if(i===Sa)return e.RGB;if(i===Tt)return e.RGBA;if(i===Wn)return e.DEPTH_COMPONENT;if(i===dn)return e.DEPTH_STENCIL;if(i===Ma)return e.RED;if(i===fr)return e.RED_INTEGER;if(i===Ta)return e.RG;if(i===dr)return e.RG_INTEGER;if(i===ur)return e.RGBA_INTEGER;if(i===Tn||i===xn||i===An||i===Rn)if(h===qe)if(o=n.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(i===Tn)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===xn)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===An)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Rn)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=n.get("WEBGL_compressed_texture_s3tc"),o!==null){if(i===Tn)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===xn)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===An)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Rn)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Jn||i===jn||i===ei||i===ti)if(o=n.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(i===Jn)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===jn)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ei)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ti)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ni||i===ii||i===ri)if(o=n.get("WEBGL_compressed_texture_etc"),o!==null){if(i===ni||i===ii)return h===qe?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(i===ri)return h===qe?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===ai||i===oi||i===si||i===ci||i===li||i===fi||i===di||i===ui||i===pi||i===hi||i===_i||i===mi||i===vi||i===gi)if(o=n.get("WEBGL_compressed_texture_astc"),o!==null){if(i===ai)return h===qe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===oi)return h===qe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===si)return h===qe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ci)return h===qe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===li)return h===qe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===fi)return h===qe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===di)return h===qe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ui)return h===qe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===pi)return h===qe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===hi)return h===qe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===_i)return h===qe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===mi)return h===qe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===vi)return h===qe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===gi)return h===qe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Cn||i===Ei||i===Si)if(o=n.get("EXT_texture_compression_bptc"),o!==null){if(i===Cn)return h===qe?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ei)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Si)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===xa||i===Mi||i===Ti||i===xi)if(o=n.get("EXT_texture_compression_rgtc"),o!==null){if(i===Cn)return o.COMPRESSED_RED_RGTC1_EXT;if(i===Mi)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ti)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===xi)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Zt?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:t}}class Ar extends vr{constructor(n=null){super(),this.sourceTexture=n,this.isExternalTexture=!0}}const Lf=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Uf=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Df{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(n,t){if(this.texture===null){const i=new Ar(n.texture);(n.depthNear!==t.depthNear||n.depthFar!==t.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=i}}getMesh(n){if(this.texture!==null&&this.mesh===null){const t=n.cameras[0].viewport,i=new Nt({vertexShader:Lf,fragmentShader:Uf,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new xt(new cr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class wf extends yr{constructor(n,t){super();const i=this;let c=null,o=1,h=null,f="local-floor",b=1,x=null,U=null,E=null,M=null,R=null,F=null;const L=new Df,l={},r=t.getContextAttributes();let I=null,A=null;const m=[],y=[],P=new dt;let N=null;const V=new sn;V.viewport=new ft;const p=new sn;p.viewport=new ft;const d=[V,p],g=new Or;let Y=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(H){let re=m[H];return re===void 0&&(re=new Sn,m[H]=re),re.getTargetRaySpace()},this.getControllerGrip=function(H){let re=m[H];return re===void 0&&(re=new Sn,m[H]=re),re.getGripSpace()},this.getHand=function(H){let re=m[H];return re===void 0&&(re=new Sn,m[H]=re),re.getHandSpace()};function k(H){const re=y.indexOf(H.inputSource);if(re===-1)return;const ee=m[re];ee!==void 0&&(ee.update(H.inputSource,H.frame,x||h),ee.dispatchEvent({type:H.type,data:H.inputSource}))}function J(){c.removeEventListener("select",k),c.removeEventListener("selectstart",k),c.removeEventListener("selectend",k),c.removeEventListener("squeeze",k),c.removeEventListener("squeezestart",k),c.removeEventListener("squeezeend",k),c.removeEventListener("end",J),c.removeEventListener("inputsourceschange",z);for(let H=0;H<m.length;H++){const re=y[H];re!==null&&(y[H]=null,m[H].disconnect(re))}Y=null,X=null,L.reset();for(const H in l)delete l[H];n.setRenderTarget(I),R=null,M=null,E=null,c=null,A=null,Ye.stop(),i.isPresenting=!1,n.setPixelRatio(N),n.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(H){o=H,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(H){f=H,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return x||h},this.setReferenceSpace=function(H){x=H},this.getBaseLayer=function(){return M!==null?M:R},this.getBinding=function(){return E},this.getFrame=function(){return F},this.getSession=function(){return c},this.setSession=async function(H){if(c=H,c!==null){if(I=n.getRenderTarget(),c.addEventListener("select",k),c.addEventListener("selectstart",k),c.addEventListener("selectend",k),c.addEventListener("squeeze",k),c.addEventListener("squeezestart",k),c.addEventListener("squeezeend",k),c.addEventListener("end",J),c.addEventListener("inputsourceschange",z),r.xrCompatible!==!0&&await t.makeXRCompatible(),N=n.getPixelRatio(),n.getSize(P),typeof XRWebGLBinding<"u"&&(E=new XRWebGLBinding(c,t)),E!==null&&"createProjectionLayer"in XRWebGLBinding.prototype){let ee=null,xe=null,Ae=null;r.depth&&(Ae=r.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ee=r.stencil?dn:Wn,xe=r.stencil?Zt:Qt);const Pe={colorFormat:t.RGBA8,depthFormat:Ae,scaleFactor:o};M=E.createProjectionLayer(Pe),c.updateRenderState({layers:[M]}),n.setPixelRatio(1),n.setSize(M.textureWidth,M.textureHeight,!1),A=new Ht(M.textureWidth,M.textureHeight,{format:Tt,type:It,depthTexture:new nr(M.textureWidth,M.textureHeight,xe,void 0,void 0,void 0,void 0,void 0,void 0,ee),stencilBuffer:r.stencil,colorSpace:n.outputColorSpace,samples:r.antialias?4:0,resolveDepthBuffer:M.ignoreDepthValues===!1,resolveStencilBuffer:M.ignoreDepthValues===!1})}else{const ee={antialias:r.antialias,alpha:!0,depth:r.depth,stencil:r.stencil,framebufferScaleFactor:o};R=new XRWebGLLayer(c,t,ee),c.updateRenderState({baseLayer:R}),n.setPixelRatio(1),n.setSize(R.framebufferWidth,R.framebufferHeight,!1),A=new Ht(R.framebufferWidth,R.framebufferHeight,{format:Tt,type:It,colorSpace:n.outputColorSpace,stencilBuffer:r.stencil,resolveDepthBuffer:R.ignoreDepthValues===!1,resolveStencilBuffer:R.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(b),x=null,h=await c.requestReferenceSpace(f),Ye.setContext(c),Ye.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(c!==null)return c.environmentBlendMode},this.getDepthTexture=function(){return L.getDepthTexture()};function z(H){for(let re=0;re<H.removed.length;re++){const ee=H.removed[re],xe=y.indexOf(ee);xe>=0&&(y[xe]=null,m[xe].disconnect(ee))}for(let re=0;re<H.added.length;re++){const ee=H.added[re];let xe=y.indexOf(ee);if(xe===-1){for(let Pe=0;Pe<m.length;Pe++)if(Pe>=y.length){y.push(ee),xe=Pe;break}else if(y[Pe]===null){y[Pe]=ee,xe=Pe;break}if(xe===-1)break}const Ae=m[xe];Ae&&Ae.connect(ee)}}const ne=new We,G=new We;function ve(H,re,ee){ne.setFromMatrixPosition(re.matrixWorld),G.setFromMatrixPosition(ee.matrixWorld);const xe=ne.distanceTo(G),Ae=re.projectionMatrix.elements,Pe=ee.projectionMatrix.elements,et=Ae[14]/(Ae[10]-1),ye=Ae[14]/(Ae[10]+1),_=(Ae[9]+1)/Ae[5],ze=(Ae[9]-1)/Ae[5],Se=(Ae[8]-1)/Ae[0],Ge=(Pe[8]+1)/Pe[0],ge=et*Se,$e=et*Ge,fe=xe/(-Se+Ge),Ie=fe*-Se;if(re.matrixWorld.decompose(H.position,H.quaternion,H.scale),H.translateX(Ie),H.translateZ(fe),H.matrixWorld.compose(H.position,H.quaternion,H.scale),H.matrixWorldInverse.copy(H.matrixWorld).invert(),Ae[10]===-1)H.projectionMatrix.copy(re.projectionMatrix),H.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const ot=et+fe,tt=ye+fe,u=ge-Ie,a=$e+(xe-Ie),C=_*ye/tt*ot,B=ze*ye/tt*ot;H.projectionMatrix.makePerspective(u,a,C,B,ot,tt),H.projectionMatrixInverse.copy(H.projectionMatrix).invert()}}function Te(H,re){re===null?H.matrixWorld.copy(H.matrix):H.matrixWorld.multiplyMatrices(re.matrixWorld,H.matrix),H.matrixWorldInverse.copy(H.matrixWorld).invert()}this.updateCamera=function(H){if(c===null)return;let re=H.near,ee=H.far;L.texture!==null&&(L.depthNear>0&&(re=L.depthNear),L.depthFar>0&&(ee=L.depthFar)),g.near=p.near=V.near=re,g.far=p.far=V.far=ee,(Y!==g.near||X!==g.far)&&(c.updateRenderState({depthNear:g.near,depthFar:g.far}),Y=g.near,X=g.far),g.layers.mask=H.layers.mask|6,V.layers.mask=g.layers.mask&3,p.layers.mask=g.layers.mask&5;const xe=H.parent,Ae=g.cameras;Te(g,xe);for(let Pe=0;Pe<Ae.length;Pe++)Te(Ae[Pe],xe);Ae.length===2?ve(g,V,p):g.projectionMatrix.copy(V.projectionMatrix),we(H,g,xe)};function we(H,re,ee){ee===null?H.matrix.copy(re.matrixWorld):(H.matrix.copy(ee.matrixWorld),H.matrix.invert(),H.matrix.multiply(re.matrixWorld)),H.matrix.decompose(H.position,H.quaternion,H.scale),H.updateMatrixWorld(!0),H.projectionMatrix.copy(re.projectionMatrix),H.projectionMatrixInverse.copy(re.projectionMatrixInverse),H.isPerspectiveCamera&&(H.fov=Fr*2*Math.atan(1/H.projectionMatrix.elements[5]),H.zoom=1)}this.getCamera=function(){return g},this.getFoveation=function(){if(!(M===null&&R===null))return b},this.setFoveation=function(H){b=H,M!==null&&(M.fixedFoveation=H),R!==null&&R.fixedFoveation!==void 0&&(R.fixedFoveation=H)},this.hasDepthSensing=function(){return L.texture!==null},this.getDepthSensingMesh=function(){return L.getMesh(g)},this.getCameraTexture=function(H){return l[H]};let Oe=null;function it(H,re){if(U=re.getViewerPose(x||h),F=re,U!==null){const ee=U.views;R!==null&&(n.setRenderTargetFramebuffer(A,R.framebuffer),n.setRenderTarget(A));let xe=!1;ee.length!==g.cameras.length&&(g.cameras.length=0,xe=!0);for(let ye=0;ye<ee.length;ye++){const _=ee[ye];let ze=null;if(R!==null)ze=R.getViewport(_);else{const Ge=E.getViewSubImage(M,_);ze=Ge.viewport,ye===0&&(n.setRenderTargetTextures(A,Ge.colorTexture,Ge.depthStencilTexture),n.setRenderTarget(A))}let Se=d[ye];Se===void 0&&(Se=new sn,Se.layers.enable(ye),Se.viewport=new ft,d[ye]=Se),Se.matrix.fromArray(_.transform.matrix),Se.matrix.decompose(Se.position,Se.quaternion,Se.scale),Se.projectionMatrix.fromArray(_.projectionMatrix),Se.projectionMatrixInverse.copy(Se.projectionMatrix).invert(),Se.viewport.set(ze.x,ze.y,ze.width,ze.height),ye===0&&(g.matrix.copy(Se.matrix),g.matrix.decompose(g.position,g.quaternion,g.scale)),xe===!0&&g.cameras.push(Se)}const Ae=c.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")&&c.depthUsage=="gpu-optimized"&&E){const ye=E.getDepthInformation(ee[0]);ye&&ye.isValid&&ye.texture&&L.init(ye,c.renderState)}if(Ae&&Ae.includes("camera-access")&&(n.state.unbindTexture(),E))for(let ye=0;ye<ee.length;ye++){const _=ee[ye].camera;if(_){let ze=l[_];ze||(ze=new Ar,l[_]=ze);const Se=E.getCameraImage(_);ze.sourceTexture=Se}}}for(let ee=0;ee<m.length;ee++){const xe=y[ee],Ae=m[ee];xe!==null&&Ae!==void 0&&Ae.update(xe,re,x||h)}Oe&&Oe(H,re),re.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:re}),F=null}const Ye=new Er;Ye.setAnimationLoop(it),this.setAnimationLoop=function(H){Oe=H},this.dispose=function(){}}}const Pt=new mr,If=new qt;function Nf(e,n){function t(l,r){l.matrixAutoUpdate===!0&&l.updateMatrix(),r.value.copy(l.matrix)}function i(l,r){r.color.getRGB(l.fogColor.value,hr(e)),r.isFog?(l.fogNear.value=r.near,l.fogFar.value=r.far):r.isFogExp2&&(l.fogDensity.value=r.density)}function c(l,r,I,A,m){r.isMeshBasicMaterial||r.isMeshLambertMaterial?o(l,r):r.isMeshToonMaterial?(o(l,r),E(l,r)):r.isMeshPhongMaterial?(o(l,r),U(l,r)):r.isMeshStandardMaterial?(o(l,r),M(l,r),r.isMeshPhysicalMaterial&&R(l,r,m)):r.isMeshMatcapMaterial?(o(l,r),F(l,r)):r.isMeshDepthMaterial?o(l,r):r.isMeshDistanceMaterial?(o(l,r),L(l,r)):r.isMeshNormalMaterial?o(l,r):r.isLineBasicMaterial?(h(l,r),r.isLineDashedMaterial&&f(l,r)):r.isPointsMaterial?b(l,r,I,A):r.isSpriteMaterial?x(l,r):r.isShadowMaterial?(l.color.value.copy(r.color),l.opacity.value=r.opacity):r.isShaderMaterial&&(r.uniformsNeedUpdate=!1)}function o(l,r){l.opacity.value=r.opacity,r.color&&l.diffuse.value.copy(r.color),r.emissive&&l.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(l.map.value=r.map,t(r.map,l.mapTransform)),r.alphaMap&&(l.alphaMap.value=r.alphaMap,t(r.alphaMap,l.alphaMapTransform)),r.bumpMap&&(l.bumpMap.value=r.bumpMap,t(r.bumpMap,l.bumpMapTransform),l.bumpScale.value=r.bumpScale,r.side===mt&&(l.bumpScale.value*=-1)),r.normalMap&&(l.normalMap.value=r.normalMap,t(r.normalMap,l.normalMapTransform),l.normalScale.value.copy(r.normalScale),r.side===mt&&l.normalScale.value.negate()),r.displacementMap&&(l.displacementMap.value=r.displacementMap,t(r.displacementMap,l.displacementMapTransform),l.displacementScale.value=r.displacementScale,l.displacementBias.value=r.displacementBias),r.emissiveMap&&(l.emissiveMap.value=r.emissiveMap,t(r.emissiveMap,l.emissiveMapTransform)),r.specularMap&&(l.specularMap.value=r.specularMap,t(r.specularMap,l.specularMapTransform)),r.alphaTest>0&&(l.alphaTest.value=r.alphaTest);const I=n.get(r),A=I.envMap,m=I.envMapRotation;A&&(l.envMap.value=A,Pt.copy(m),Pt.x*=-1,Pt.y*=-1,Pt.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(Pt.y*=-1,Pt.z*=-1),l.envMapRotation.value.setFromMatrix4(If.makeRotationFromEuler(Pt)),l.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,l.reflectivity.value=r.reflectivity,l.ior.value=r.ior,l.refractionRatio.value=r.refractionRatio),r.lightMap&&(l.lightMap.value=r.lightMap,l.lightMapIntensity.value=r.lightMapIntensity,t(r.lightMap,l.lightMapTransform)),r.aoMap&&(l.aoMap.value=r.aoMap,l.aoMapIntensity.value=r.aoMapIntensity,t(r.aoMap,l.aoMapTransform))}function h(l,r){l.diffuse.value.copy(r.color),l.opacity.value=r.opacity,r.map&&(l.map.value=r.map,t(r.map,l.mapTransform))}function f(l,r){l.dashSize.value=r.dashSize,l.totalSize.value=r.dashSize+r.gapSize,l.scale.value=r.scale}function b(l,r,I,A){l.diffuse.value.copy(r.color),l.opacity.value=r.opacity,l.size.value=r.size*I,l.scale.value=A*.5,r.map&&(l.map.value=r.map,t(r.map,l.uvTransform)),r.alphaMap&&(l.alphaMap.value=r.alphaMap,t(r.alphaMap,l.alphaMapTransform)),r.alphaTest>0&&(l.alphaTest.value=r.alphaTest)}function x(l,r){l.diffuse.value.copy(r.color),l.opacity.value=r.opacity,l.rotation.value=r.rotation,r.map&&(l.map.value=r.map,t(r.map,l.mapTransform)),r.alphaMap&&(l.alphaMap.value=r.alphaMap,t(r.alphaMap,l.alphaMapTransform)),r.alphaTest>0&&(l.alphaTest.value=r.alphaTest)}function U(l,r){l.specular.value.copy(r.specular),l.shininess.value=Math.max(r.shininess,1e-4)}function E(l,r){r.gradientMap&&(l.gradientMap.value=r.gradientMap)}function M(l,r){l.metalness.value=r.metalness,r.metalnessMap&&(l.metalnessMap.value=r.metalnessMap,t(r.metalnessMap,l.metalnessMapTransform)),l.roughness.value=r.roughness,r.roughnessMap&&(l.roughnessMap.value=r.roughnessMap,t(r.roughnessMap,l.roughnessMapTransform)),r.envMap&&(l.envMapIntensity.value=r.envMapIntensity)}function R(l,r,I){l.ior.value=r.ior,r.sheen>0&&(l.sheenColor.value.copy(r.sheenColor).multiplyScalar(r.sheen),l.sheenRoughness.value=r.sheenRoughness,r.sheenColorMap&&(l.sheenColorMap.value=r.sheenColorMap,t(r.sheenColorMap,l.sheenColorMapTransform)),r.sheenRoughnessMap&&(l.sheenRoughnessMap.value=r.sheenRoughnessMap,t(r.sheenRoughnessMap,l.sheenRoughnessMapTransform))),r.clearcoat>0&&(l.clearcoat.value=r.clearcoat,l.clearcoatRoughness.value=r.clearcoatRoughness,r.clearcoatMap&&(l.clearcoatMap.value=r.clearcoatMap,t(r.clearcoatMap,l.clearcoatMapTransform)),r.clearcoatRoughnessMap&&(l.clearcoatRoughnessMap.value=r.clearcoatRoughnessMap,t(r.clearcoatRoughnessMap,l.clearcoatRoughnessMapTransform)),r.clearcoatNormalMap&&(l.clearcoatNormalMap.value=r.clearcoatNormalMap,t(r.clearcoatNormalMap,l.clearcoatNormalMapTransform),l.clearcoatNormalScale.value.copy(r.clearcoatNormalScale),r.side===mt&&l.clearcoatNormalScale.value.negate())),r.dispersion>0&&(l.dispersion.value=r.dispersion),r.iridescence>0&&(l.iridescence.value=r.iridescence,l.iridescenceIOR.value=r.iridescenceIOR,l.iridescenceThicknessMinimum.value=r.iridescenceThicknessRange[0],l.iridescenceThicknessMaximum.value=r.iridescenceThicknessRange[1],r.iridescenceMap&&(l.iridescenceMap.value=r.iridescenceMap,t(r.iridescenceMap,l.iridescenceMapTransform)),r.iridescenceThicknessMap&&(l.iridescenceThicknessMap.value=r.iridescenceThicknessMap,t(r.iridescenceThicknessMap,l.iridescenceThicknessMapTransform))),r.transmission>0&&(l.transmission.value=r.transmission,l.transmissionSamplerMap.value=I.texture,l.transmissionSamplerSize.value.set(I.width,I.height),r.transmissionMap&&(l.transmissionMap.value=r.transmissionMap,t(r.transmissionMap,l.transmissionMapTransform)),l.thickness.value=r.thickness,r.thicknessMap&&(l.thicknessMap.value=r.thicknessMap,t(r.thicknessMap,l.thicknessMapTransform)),l.attenuationDistance.value=r.attenuationDistance,l.attenuationColor.value.copy(r.attenuationColor)),r.anisotropy>0&&(l.anisotropyVector.value.set(r.anisotropy*Math.cos(r.anisotropyRotation),r.anisotropy*Math.sin(r.anisotropyRotation)),r.anisotropyMap&&(l.anisotropyMap.value=r.anisotropyMap,t(r.anisotropyMap,l.anisotropyMapTransform))),l.specularIntensity.value=r.specularIntensity,l.specularColor.value.copy(r.specularColor),r.specularColorMap&&(l.specularColorMap.value=r.specularColorMap,t(r.specularColorMap,l.specularColorMapTransform)),r.specularIntensityMap&&(l.specularIntensityMap.value=r.specularIntensityMap,t(r.specularIntensityMap,l.specularIntensityMapTransform))}function F(l,r){r.matcap&&(l.matcap.value=r.matcap)}function L(l,r){const I=n.get(r).light;l.referencePosition.value.setFromMatrixPosition(I.matrixWorld),l.nearDistance.value=I.shadow.camera.near,l.farDistance.value=I.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:c}}function yf(e,n,t,i){let c={},o={},h=[];const f=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function b(I,A){const m=A.program;i.uniformBlockBinding(I,m)}function x(I,A){let m=c[I.id];m===void 0&&(F(I),m=U(I),c[I.id]=m,I.addEventListener("dispose",l));const y=A.program;i.updateUBOMapping(I,y);const P=n.render.frame;o[I.id]!==P&&(M(I),o[I.id]=P)}function U(I){const A=E();I.__bindingPointIndex=A;const m=e.createBuffer(),y=I.__size,P=I.usage;return e.bindBuffer(e.UNIFORM_BUFFER,m),e.bufferData(e.UNIFORM_BUFFER,y,P),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,A,m),m}function E(){for(let I=0;I<f;I++)if(h.indexOf(I)===-1)return h.push(I),I;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function M(I){const A=c[I.id],m=I.uniforms,y=I.__cache;e.bindBuffer(e.UNIFORM_BUFFER,A);for(let P=0,N=m.length;P<N;P++){const V=Array.isArray(m[P])?m[P]:[m[P]];for(let p=0,d=V.length;p<d;p++){const g=V[p];if(R(g,P,p,y)===!0){const Y=g.__offset,X=Array.isArray(g.value)?g.value:[g.value];let k=0;for(let J=0;J<X.length;J++){const z=X[J],ne=L(z);typeof z=="number"||typeof z=="boolean"?(g.__data[0]=z,e.bufferSubData(e.UNIFORM_BUFFER,Y+k,g.__data)):z.isMatrix3?(g.__data[0]=z.elements[0],g.__data[1]=z.elements[1],g.__data[2]=z.elements[2],g.__data[3]=0,g.__data[4]=z.elements[3],g.__data[5]=z.elements[4],g.__data[6]=z.elements[5],g.__data[7]=0,g.__data[8]=z.elements[6],g.__data[9]=z.elements[7],g.__data[10]=z.elements[8],g.__data[11]=0):(z.toArray(g.__data,k),k+=ne.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,Y,g.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function R(I,A,m,y){const P=I.value,N=A+"_"+m;if(y[N]===void 0)return typeof P=="number"||typeof P=="boolean"?y[N]=P:y[N]=P.clone(),!0;{const V=y[N];if(typeof P=="number"||typeof P=="boolean"){if(V!==P)return y[N]=P,!0}else if(V.equals(P)===!1)return V.copy(P),!0}return!1}function F(I){const A=I.uniforms;let m=0;const y=16;for(let N=0,V=A.length;N<V;N++){const p=Array.isArray(A[N])?A[N]:[A[N]];for(let d=0,g=p.length;d<g;d++){const Y=p[d],X=Array.isArray(Y.value)?Y.value:[Y.value];for(let k=0,J=X.length;k<J;k++){const z=X[k],ne=L(z),G=m%y,ve=G%ne.boundary,Te=G+ve;m+=ve,Te!==0&&y-Te<ne.storage&&(m+=y-Te),Y.__data=new Float32Array(ne.storage/Float32Array.BYTES_PER_ELEMENT),Y.__offset=m,m+=ne.storage}}}const P=m%y;return P>0&&(m+=y-P),I.__size=m,I.__cache={},this}function L(I){const A={boundary:0,storage:0};return typeof I=="number"||typeof I=="boolean"?(A.boundary=4,A.storage=4):I.isVector2?(A.boundary=8,A.storage=8):I.isVector3||I.isColor?(A.boundary=16,A.storage=12):I.isVector4?(A.boundary=16,A.storage=16):I.isMatrix3?(A.boundary=48,A.storage=48):I.isMatrix4?(A.boundary=64,A.storage=64):I.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",I),A}function l(I){const A=I.target;A.removeEventListener("dispose",l);const m=h.indexOf(A.__bindingPointIndex);h.splice(m,1),e.deleteBuffer(c[A.id]),delete c[A.id],delete o[A.id]}function r(){for(const I in c)e.deleteBuffer(c[I]);h=[],c={},o={}}return{bind:b,update:x,dispose:r}}class Ff{constructor(n={}){const{canvas:t=Dr(),context:i=null,depth:c=!0,stencil:o=!1,alpha:h=!1,antialias:f=!1,premultipliedAlpha:b=!0,preserveDrawingBuffer:x=!1,powerPreference:U="default",failIfMajorPerformanceCaveat:E=!1,reversedDepthBuffer:M=!1}=n;this.isWebGLRenderer=!0;let R;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");R=i.getContextAttributes().alpha}else R=h;const F=new Uint32Array(4),L=new Int32Array(4);let l=null,r=null;const I=[],A=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=At,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const m=this;let y=!1;this._outputColorSpace=wr;let P=0,N=0,V=null,p=-1,d=null;const g=new ft,Y=new ft;let X=null;const k=new Ze(0);let J=0,z=t.width,ne=t.height,G=1,ve=null,Te=null;const we=new ft(0,0,z,ne),Oe=new ft(0,0,z,ne);let it=!1;const Ye=new tr;let H=!1,re=!1;const ee=new qt,xe=new We,Ae=new ft,Pe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let et=!1;function ye(){return V===null?G:1}let _=i;function ze(s,S){return t.getContext(s,S)}try{const s={alpha:!0,depth:c,stencil:o,antialias:f,premultipliedAlpha:b,preserveDrawingBuffer:x,powerPreference:U,failIfMajorPerformanceCaveat:E};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ir}`),t.addEventListener("webglcontextlost",te,!1),t.addEventListener("webglcontextrestored",le,!1),t.addEventListener("webglcontextcreationerror",q,!1),_===null){const S="webgl2";if(_=ze(S,s),_===null)throw ze(S)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(s){throw console.error("THREE.WebGLRenderer: "+s.message),s}let Se,Ge,ge,$e,fe,Ie,ot,tt,u,a,C,B,K,O,me,j,pe,he,Z,se,Ce,_e,ae,Ue;function v(){Se=new Xc(_),Se.init(),_e=new Pf(_,Se),Ge=new Bc(_,Se,n,_e),ge=new Cf(_,Se),Ge.reversedDepthBuffer&&M&&ge.buffers.depth.setReversed(!0),$e=new qc(_),fe=new pf,Ie=new bf(_,Se,ge,fe,Ge,_e,$e),ot=new Hc(m),tt=new zc(m),u=new ja(_),ae=new Oc(_,u),a=new Yc(_,u,$e,ae),C=new Zc(_,a,u,$e),Z=new $c(_,Ge,Ie),j=new Gc(fe),B=new uf(m,ot,tt,Se,Ge,ae,j),K=new Nf(m,fe),O=new _f,me=new Mf(Se),he=new yc(m,ot,tt,ge,C,R,b),pe=new Af(m,C,Ge),Ue=new yf(_,$e,Ge,ge),se=new Fc(_,Se,$e),Ce=new Kc(_,Se,$e),$e.programs=B.programs,m.capabilities=Ge,m.extensions=Se,m.properties=fe,m.renderLists=O,m.shadowMap=pe,m.state=ge,m.info=$e}v();const Q=new wf(m,_);this.xr=Q,this.getContext=function(){return _},this.getContextAttributes=function(){return _.getContextAttributes()},this.forceContextLoss=function(){const s=Se.get("WEBGL_lose_context");s&&s.loseContext()},this.forceContextRestore=function(){const s=Se.get("WEBGL_lose_context");s&&s.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(s){s!==void 0&&(G=s,this.setSize(z,ne,!1))},this.getSize=function(s){return s.set(z,ne)},this.setSize=function(s,S,D=!0){if(Q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=s,ne=S,t.width=Math.floor(s*G),t.height=Math.floor(S*G),D===!0&&(t.style.width=s+"px",t.style.height=S+"px"),this.setViewport(0,0,s,S)},this.getDrawingBufferSize=function(s){return s.set(z*G,ne*G).floor()},this.setDrawingBufferSize=function(s,S,D){z=s,ne=S,G=D,t.width=Math.floor(s*D),t.height=Math.floor(S*D),this.setViewport(0,0,s,S)},this.getCurrentViewport=function(s){return s.copy(g)},this.getViewport=function(s){return s.copy(we)},this.setViewport=function(s,S,D,w){s.isVector4?we.set(s.x,s.y,s.z,s.w):we.set(s,S,D,w),ge.viewport(g.copy(we).multiplyScalar(G).round())},this.getScissor=function(s){return s.copy(Oe)},this.setScissor=function(s,S,D,w){s.isVector4?Oe.set(s.x,s.y,s.z,s.w):Oe.set(s,S,D,w),ge.scissor(Y.copy(Oe).multiplyScalar(G).round())},this.getScissorTest=function(){return it},this.setScissorTest=function(s){ge.setScissorTest(it=s)},this.setOpaqueSort=function(s){ve=s},this.setTransparentSort=function(s){Te=s},this.getClearColor=function(s){return s.copy(he.getClearColor())},this.setClearColor=function(){he.setClearColor(...arguments)},this.getClearAlpha=function(){return he.getClearAlpha()},this.setClearAlpha=function(){he.setClearAlpha(...arguments)},this.clear=function(s=!0,S=!0,D=!0){let w=0;if(s){let T=!1;if(V!==null){const $=V.texture.format;T=$===ur||$===dr||$===fr}if(T){const $=V.texture.type,oe=$===It||$===Qt||$===pn||$===Zt||$===or||$===sr,de=he.getClearColor(),ce=he.getClearAlpha(),Re=de.r,be=de.g,Ee=de.b;oe?(F[0]=Re,F[1]=be,F[2]=Ee,F[3]=ce,_.clearBufferuiv(_.COLOR,0,F)):(L[0]=Re,L[1]=be,L[2]=Ee,L[3]=ce,_.clearBufferiv(_.COLOR,0,L))}else w|=_.COLOR_BUFFER_BIT}S&&(w|=_.DEPTH_BUFFER_BIT),D&&(w|=_.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),_.clear(w)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",te,!1),t.removeEventListener("webglcontextrestored",le,!1),t.removeEventListener("webglcontextcreationerror",q,!1),he.dispose(),O.dispose(),me.dispose(),fe.dispose(),ot.dispose(),tt.dispose(),C.dispose(),ae.dispose(),Ue.dispose(),B.dispose(),Q.dispose(),Q.removeEventListener("sessionstart",vt),Q.removeEventListener("sessionend",Xn),Rt.stop()};function te(s){s.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function le(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const s=$e.autoReset,S=pe.enabled,D=pe.autoUpdate,w=pe.needsUpdate,T=pe.type;v(),$e.autoReset=s,pe.enabled=S,pe.autoUpdate=D,pe.needsUpdate=w,pe.type=T}function q(s){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",s.statusMessage)}function W(s){const S=s.target;S.removeEventListener("dispose",W),ue(S)}function ue(s){Le(s),fe.remove(s)}function Le(s){const S=fe.get(s).programs;S!==void 0&&(S.forEach(function(D){B.releaseProgram(D)}),s.isShaderMaterial&&B.releaseShaderCache(s))}this.renderBufferDirect=function(s,S,D,w,T,$){S===null&&(S=Pe);const oe=T.isMesh&&T.matrixWorld.determinant()<0,de=Rr(s,S,D,w,T);ge.setMaterial(w,oe);let ce=D.index,Re=1;if(w.wireframe===!0){if(ce=a.getWireframeAttribute(D),ce===void 0)return;Re=2}const be=D.drawRange,Ee=D.attributes.position;let Ne=be.start*Re,Ve=(be.start+be.count)*Re;$!==null&&(Ne=Math.max(Ne,$.start*Re),Ve=Math.min(Ve,($.start+$.count)*Re)),ce!==null?(Ne=Math.max(Ne,0),Ve=Math.min(Ve,ce.count)):Ee!=null&&(Ne=Math.max(Ne,0),Ve=Math.min(Ve,Ee.count));const je=Ve-Ne;if(je<0||je===1/0)return;ae.setup(T,w,de,D,ce);let Ke,ke=se;if(ce!==null&&(Ke=u.get(ce),ke=Ce,ke.setIndex(Ke)),T.isMesh)w.wireframe===!0?(ge.setLineWidth(w.wireframeLinewidth*ye()),ke.setMode(_.LINES)):ke.setMode(_.TRIANGLES);else if(T.isLine){let Me=w.linewidth;Me===void 0&&(Me=1),ge.setLineWidth(Me*ye()),T.isLineSegments?ke.setMode(_.LINES):T.isLineLoop?ke.setMode(_.LINE_LOOP):ke.setMode(_.LINE_STRIP)}else T.isPoints?ke.setMode(_.POINTS):T.isSprite&&ke.setMode(_.TRIANGLES);if(T.isBatchedMesh)if(T._multiDrawInstances!==null)on("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ke.renderMultiDrawInstances(T._multiDrawStarts,T._multiDrawCounts,T._multiDrawCount,T._multiDrawInstances);else if(Se.get("WEBGL_multi_draw"))ke.renderMultiDraw(T._multiDrawStarts,T._multiDrawCounts,T._multiDrawCount);else{const Me=T._multiDrawStarts,Qe=T._multiDrawCounts,Fe=T._multiDrawCount,ut=ce?u.get(ce).bytesPerElement:1,yt=fe.get(w).currentProgram.getUniforms();for(let pt=0;pt<Fe;pt++)yt.setValue(_,"_gl_DrawID",pt),ke.render(Me[pt]/ut,Qe[pt])}else if(T.isInstancedMesh)ke.renderInstances(Ne,je,T.count);else if(D.isInstancedBufferGeometry){const Me=D._maxInstanceCount!==void 0?D._maxInstanceCount:1/0,Qe=Math.min(D.instanceCount,Me);ke.renderInstances(Ne,je,Qe)}else ke.render(Ne,je)};function Xe(s,S,D){s.transparent===!0&&s.side===Mt&&s.forceSinglePass===!1?(s.side=mt,s.needsUpdate=!0,en(s,S,D),s.side=$t,s.needsUpdate=!0,en(s,S,D),s.side=Mt):en(s,S,D)}this.compile=function(s,S,D=null){D===null&&(D=s),r=me.get(D),r.init(S),A.push(r),D.traverseVisible(function(T){T.isLight&&T.layers.test(S.layers)&&(r.pushLight(T),T.castShadow&&r.pushShadow(T))}),s!==D&&s.traverseVisible(function(T){T.isLight&&T.layers.test(S.layers)&&(r.pushLight(T),T.castShadow&&r.pushShadow(T))}),r.setupLights();const w=new Set;return s.traverse(function(T){if(!(T.isMesh||T.isPoints||T.isLine||T.isSprite))return;const $=T.material;if($)if(Array.isArray($))for(let oe=0;oe<$.length;oe++){const de=$[oe];Xe(de,D,T),w.add(de)}else Xe($,D,T),w.add($)}),r=A.pop(),w},this.compileAsync=function(s,S,D=null){const w=this.compile(s,S,D);return new Promise(T=>{function $(){if(w.forEach(function(oe){fe.get(oe).currentProgram.isReady()&&w.delete(oe)}),w.size===0){T(s);return}setTimeout($,10)}Se.get("KHR_parallel_shader_compile")!==null?$():setTimeout($,10)})};let He=null;function Et(s){He&&He(s)}function vt(){Rt.stop()}function Xn(){Rt.start()}const Rt=new Er;Rt.setAnimationLoop(Et),typeof self<"u"&&Rt.setContext(self),this.setAnimationLoop=function(s){He=s,Q.setAnimationLoop(s),s===null?Rt.stop():Rt.start()},Q.addEventListener("sessionstart",vt),Q.addEventListener("sessionend",Xn),this.render=function(s,S){if(S!==void 0&&S.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;if(s.matrixWorldAutoUpdate===!0&&s.updateMatrixWorld(),S.parent===null&&S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),Q.enabled===!0&&Q.isPresenting===!0&&(Q.cameraAutoUpdate===!0&&Q.updateCamera(S),S=Q.getCamera()),s.isScene===!0&&s.onBeforeRender(m,s,S,V),r=me.get(s,A.length),r.init(S),A.push(r),ee.multiplyMatrices(S.projectionMatrix,S.matrixWorldInverse),Ye.setFromProjectionMatrix(ee,Qn,S.reversedDepth),re=this.localClippingEnabled,H=j.init(this.clippingPlanes,re),l=O.get(s,I.length),l.init(),I.push(l),Q.enabled===!0&&Q.isPresenting===!0){const $=m.xr.getDepthSensingMesh();$!==null&&gn($,S,-1/0,m.sortObjects)}gn(s,S,0,m.sortObjects),l.finish(),m.sortObjects===!0&&l.sort(ve,Te),et=Q.enabled===!1||Q.isPresenting===!1||Q.hasDepthSensing()===!1,et&&he.addToRenderList(l,s),this.info.render.frame++,H===!0&&j.beginShadows();const D=r.state.shadowsArray;pe.render(D,s,S),H===!0&&j.endShadows(),this.info.autoReset===!0&&this.info.reset();const w=l.opaque,T=l.transmissive;if(r.setupLights(),S.isArrayCamera){const $=S.cameras;if(T.length>0)for(let oe=0,de=$.length;oe<de;oe++){const ce=$[oe];Kn(w,T,s,ce)}et&&he.render(s);for(let oe=0,de=$.length;oe<de;oe++){const ce=$[oe];Yn(l,s,ce,ce.viewport)}}else T.length>0&&Kn(w,T,s,S),et&&he.render(s),Yn(l,s,S);V!==null&&N===0&&(Ie.updateMultisampleRenderTarget(V),Ie.updateRenderTargetMipmap(V)),s.isScene===!0&&s.onAfterRender(m,s,S),ae.resetDefaultState(),p=-1,d=null,A.pop(),A.length>0?(r=A[A.length-1],H===!0&&j.setGlobalState(m.clippingPlanes,r.state.camera)):r=null,I.pop(),I.length>0?l=I[I.length-1]:l=null};function gn(s,S,D,w){if(s.visible===!1)return;if(s.layers.test(S.layers)){if(s.isGroup)D=s.renderOrder;else if(s.isLOD)s.autoUpdate===!0&&s.update(S);else if(s.isLight)r.pushLight(s),s.castShadow&&r.pushShadow(s);else if(s.isSprite){if(!s.frustumCulled||Ye.intersectsSprite(s)){w&&Ae.setFromMatrixPosition(s.matrixWorld).applyMatrix4(ee);const oe=C.update(s),de=s.material;de.visible&&l.push(s,oe,de,D,Ae.z,null)}}else if((s.isMesh||s.isLine||s.isPoints)&&(!s.frustumCulled||Ye.intersectsObject(s))){const oe=C.update(s),de=s.material;if(w&&(s.boundingSphere!==void 0?(s.boundingSphere===null&&s.computeBoundingSphere(),Ae.copy(s.boundingSphere.center)):(oe.boundingSphere===null&&oe.computeBoundingSphere(),Ae.copy(oe.boundingSphere.center)),Ae.applyMatrix4(s.matrixWorld).applyMatrix4(ee)),Array.isArray(de)){const ce=oe.groups;for(let Re=0,be=ce.length;Re<be;Re++){const Ee=ce[Re],Ne=de[Ee.materialIndex];Ne&&Ne.visible&&l.push(s,oe,Ne,D,Ae.z,Ee)}}else de.visible&&l.push(s,oe,de,D,Ae.z,null)}}const $=s.children;for(let oe=0,de=$.length;oe<de;oe++)gn($[oe],S,D,w)}function Yn(s,S,D,w){const T=s.opaque,$=s.transmissive,oe=s.transparent;r.setupLightsView(D),H===!0&&j.setGlobalState(m.clippingPlanes,D),w&&ge.viewport(g.copy(w)),T.length>0&&jt(T,S,D),$.length>0&&jt($,S,D),oe.length>0&&jt(oe,S,D),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function Kn(s,S,D,w){if((D.isScene===!0?D.overrideMaterial:null)!==null)return;r.state.transmissionRenderTarget[w.id]===void 0&&(r.state.transmissionRenderTarget[w.id]=new Ht(1,1,{generateMipmaps:!0,type:Se.has("EXT_color_buffer_half_float")||Se.has("EXT_color_buffer_float")?hn:It,minFilter:Xt,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:nt.workingColorSpace}));const $=r.state.transmissionRenderTarget[w.id],oe=w.viewport||g;$.setSize(oe.z*m.transmissionResolutionScale,oe.w*m.transmissionResolutionScale);const de=m.getRenderTarget(),ce=m.getActiveCubeFace(),Re=m.getActiveMipmapLevel();m.setRenderTarget($),m.getClearColor(k),J=m.getClearAlpha(),J<1&&m.setClearColor(16777215,.5),m.clear(),et&&he.render(D);const be=m.toneMapping;m.toneMapping=At;const Ee=w.viewport;if(w.viewport!==void 0&&(w.viewport=void 0),r.setupLightsView(w),H===!0&&j.setGlobalState(m.clippingPlanes,w),jt(s,D,w),Ie.updateMultisampleRenderTarget($),Ie.updateRenderTargetMipmap($),Se.has("WEBGL_multisampled_render_to_texture")===!1){let Ne=!1;for(let Ve=0,je=S.length;Ve<je;Ve++){const Ke=S[Ve],ke=Ke.object,Me=Ke.geometry,Qe=Ke.material,Fe=Ke.group;if(Qe.side===Mt&&ke.layers.test(w.layers)){const ut=Qe.side;Qe.side=mt,Qe.needsUpdate=!0,qn(ke,D,w,Me,Qe,Fe),Qe.side=ut,Qe.needsUpdate=!0,Ne=!0}}Ne===!0&&(Ie.updateMultisampleRenderTarget($),Ie.updateRenderTargetMipmap($))}m.setRenderTarget(de,ce,Re),m.setClearColor(k,J),Ee!==void 0&&(w.viewport=Ee),m.toneMapping=be}function jt(s,S,D){const w=S.isScene===!0?S.overrideMaterial:null;for(let T=0,$=s.length;T<$;T++){const oe=s[T],de=oe.object,ce=oe.geometry,Re=oe.group;let be=oe.material;be.allowOverride===!0&&w!==null&&(be=w),de.layers.test(D.layers)&&qn(de,S,D,ce,be,Re)}}function qn(s,S,D,w,T,$){s.onBeforeRender(m,S,D,w,T,$),s.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,s.matrixWorld),s.normalMatrix.getNormalMatrix(s.modelViewMatrix),T.onBeforeRender(m,S,D,w,s,$),T.transparent===!0&&T.side===Mt&&T.forceSinglePass===!1?(T.side=mt,T.needsUpdate=!0,m.renderBufferDirect(D,S,w,T,s,$),T.side=$t,T.needsUpdate=!0,m.renderBufferDirect(D,S,w,T,s,$),T.side=Mt):m.renderBufferDirect(D,S,w,T,s,$),s.onAfterRender(m,S,D,w,T,$)}function en(s,S,D){S.isScene!==!0&&(S=Pe);const w=fe.get(s),T=r.state.lights,$=r.state.shadowsArray,oe=T.state.version,de=B.getParameters(s,T.state,$,S,D),ce=B.getProgramCacheKey(de);let Re=w.programs;w.environment=s.isMeshStandardMaterial?S.environment:null,w.fog=S.fog,w.envMap=(s.isMeshStandardMaterial?tt:ot).get(s.envMap||w.environment),w.envMapRotation=w.environment!==null&&s.envMap===null?S.environmentRotation:s.envMapRotation,Re===void 0&&(s.addEventListener("dispose",W),Re=new Map,w.programs=Re);let be=Re.get(ce);if(be!==void 0){if(w.currentProgram===be&&w.lightsStateVersion===oe)return Zn(s,de),be}else de.uniforms=B.getUniforms(s),s.onBeforeCompile(de,m),be=B.acquireProgram(de,ce),Re.set(ce,be),w.uniforms=de.uniforms;const Ee=w.uniforms;return(!s.isShaderMaterial&&!s.isRawShaderMaterial||s.clipping===!0)&&(Ee.clippingPlanes=j.uniform),Zn(s,de),w.needsLights=br(s),w.lightsStateVersion=oe,w.needsLights&&(Ee.ambientLightColor.value=T.state.ambient,Ee.lightProbe.value=T.state.probe,Ee.directionalLights.value=T.state.directional,Ee.directionalLightShadows.value=T.state.directionalShadow,Ee.spotLights.value=T.state.spot,Ee.spotLightShadows.value=T.state.spotShadow,Ee.rectAreaLights.value=T.state.rectArea,Ee.ltc_1.value=T.state.rectAreaLTC1,Ee.ltc_2.value=T.state.rectAreaLTC2,Ee.pointLights.value=T.state.point,Ee.pointLightShadows.value=T.state.pointShadow,Ee.hemisphereLights.value=T.state.hemi,Ee.directionalShadowMap.value=T.state.directionalShadowMap,Ee.directionalShadowMatrix.value=T.state.directionalShadowMatrix,Ee.spotShadowMap.value=T.state.spotShadowMap,Ee.spotLightMatrix.value=T.state.spotLightMatrix,Ee.spotLightMap.value=T.state.spotLightMap,Ee.pointShadowMap.value=T.state.pointShadowMap,Ee.pointShadowMatrix.value=T.state.pointShadowMatrix),w.currentProgram=be,w.uniformsList=null,be}function $n(s){if(s.uniformsList===null){const S=s.currentProgram.getUniforms();s.uniformsList=fn.seqWithValue(S.seq,s.uniforms)}return s.uniformsList}function Zn(s,S){const D=fe.get(s);D.outputColorSpace=S.outputColorSpace,D.batching=S.batching,D.batchingColor=S.batchingColor,D.instancing=S.instancing,D.instancingColor=S.instancingColor,D.instancingMorph=S.instancingMorph,D.skinning=S.skinning,D.morphTargets=S.morphTargets,D.morphNormals=S.morphNormals,D.morphColors=S.morphColors,D.morphTargetsCount=S.morphTargetsCount,D.numClippingPlanes=S.numClippingPlanes,D.numIntersection=S.numClipIntersection,D.vertexAlphas=S.vertexAlphas,D.vertexTangents=S.vertexTangents,D.toneMapping=S.toneMapping}function Rr(s,S,D,w,T){S.isScene!==!0&&(S=Pe),Ie.resetTextureUnits();const $=S.fog,oe=w.isMeshStandardMaterial?S.environment:null,de=V===null?m.outputColorSpace:V.isXRRenderTarget===!0?V.texture.colorSpace:_n,ce=(w.isMeshStandardMaterial?tt:ot).get(w.envMap||oe),Re=w.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,be=!!D.attributes.tangent&&(!!w.normalMap||w.anisotropy>0),Ee=!!D.morphAttributes.position,Ne=!!D.morphAttributes.normal,Ve=!!D.morphAttributes.color;let je=At;w.toneMapped&&(V===null||V.isXRRenderTarget===!0)&&(je=m.toneMapping);const Ke=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,ke=Ke!==void 0?Ke.length:0,Me=fe.get(w),Qe=r.state.lights;if(H===!0&&(re===!0||s!==d)){const st=s===d&&w.id===p;j.setState(w,s,st)}let Fe=!1;w.version===Me.__version?(Me.needsLights&&Me.lightsStateVersion!==Qe.state.version||Me.outputColorSpace!==de||T.isBatchedMesh&&Me.batching===!1||!T.isBatchedMesh&&Me.batching===!0||T.isBatchedMesh&&Me.batchingColor===!0&&T.colorTexture===null||T.isBatchedMesh&&Me.batchingColor===!1&&T.colorTexture!==null||T.isInstancedMesh&&Me.instancing===!1||!T.isInstancedMesh&&Me.instancing===!0||T.isSkinnedMesh&&Me.skinning===!1||!T.isSkinnedMesh&&Me.skinning===!0||T.isInstancedMesh&&Me.instancingColor===!0&&T.instanceColor===null||T.isInstancedMesh&&Me.instancingColor===!1&&T.instanceColor!==null||T.isInstancedMesh&&Me.instancingMorph===!0&&T.morphTexture===null||T.isInstancedMesh&&Me.instancingMorph===!1&&T.morphTexture!==null||Me.envMap!==ce||w.fog===!0&&Me.fog!==$||Me.numClippingPlanes!==void 0&&(Me.numClippingPlanes!==j.numPlanes||Me.numIntersection!==j.numIntersection)||Me.vertexAlphas!==Re||Me.vertexTangents!==be||Me.morphTargets!==Ee||Me.morphNormals!==Ne||Me.morphColors!==Ve||Me.toneMapping!==je||Me.morphTargetsCount!==ke)&&(Fe=!0):(Fe=!0,Me.__version=w.version);let ut=Me.currentProgram;Fe===!0&&(ut=en(w,S,T));let yt=!1,pt=!1,Wt=!1;const Je=ut.getUniforms(),ht=Me.uniforms;if(ge.useProgram(ut.program)&&(yt=!0,pt=!0,Wt=!0),w.id!==p&&(p=w.id,pt=!0),yt||d!==s){ge.buffers.depth.getReversed()&&s.reversedDepth!==!0&&(s._reversedDepth=!0,s.updateProjectionMatrix()),Je.setValue(_,"projectionMatrix",s.projectionMatrix),Je.setValue(_,"viewMatrix",s.matrixWorldInverse);const ct=Je.map.cameraPosition;ct!==void 0&&ct.setValue(_,xe.setFromMatrixPosition(s.matrixWorld)),Ge.logarithmicDepthBuffer&&Je.setValue(_,"logDepthBufFC",2/(Math.log(s.far+1)/Math.LN2)),(w.isMeshPhongMaterial||w.isMeshToonMaterial||w.isMeshLambertMaterial||w.isMeshBasicMaterial||w.isMeshStandardMaterial||w.isShaderMaterial)&&Je.setValue(_,"isOrthographic",s.isOrthographicCamera===!0),d!==s&&(d=s,pt=!0,Wt=!0)}if(T.isSkinnedMesh){Je.setOptional(_,T,"bindMatrix"),Je.setOptional(_,T,"bindMatrixInverse");const st=T.skeleton;st&&(st.boneTexture===null&&st.computeBoneTexture(),Je.setValue(_,"boneTexture",st.boneTexture,Ie))}T.isBatchedMesh&&(Je.setOptional(_,T,"batchingTexture"),Je.setValue(_,"batchingTexture",T._matricesTexture,Ie),Je.setOptional(_,T,"batchingIdTexture"),Je.setValue(_,"batchingIdTexture",T._indirectTexture,Ie),Je.setOptional(_,T,"batchingColorTexture"),T._colorsTexture!==null&&Je.setValue(_,"batchingColorTexture",T._colorsTexture,Ie));const _t=D.morphAttributes;if((_t.position!==void 0||_t.normal!==void 0||_t.color!==void 0)&&Z.update(T,D,ut),(pt||Me.receiveShadow!==T.receiveShadow)&&(Me.receiveShadow=T.receiveShadow,Je.setValue(_,"receiveShadow",T.receiveShadow)),w.isMeshGouraudMaterial&&w.envMap!==null&&(ht.envMap.value=ce,ht.flipEnvMap.value=ce.isCubeTexture&&ce.isRenderTargetTexture===!1?-1:1),w.isMeshStandardMaterial&&w.envMap===null&&S.environment!==null&&(ht.envMapIntensity.value=S.environmentIntensity),pt&&(Je.setValue(_,"toneMappingExposure",m.toneMappingExposure),Me.needsLights&&Cr(ht,Wt),$&&w.fog===!0&&K.refreshFogUniforms(ht,$),K.refreshMaterialUniforms(ht,w,G,ne,r.state.transmissionRenderTarget[s.id]),fn.upload(_,$n(Me),ht,Ie)),w.isShaderMaterial&&w.uniformsNeedUpdate===!0&&(fn.upload(_,$n(Me),ht,Ie),w.uniformsNeedUpdate=!1),w.isSpriteMaterial&&Je.setValue(_,"center",T.center),Je.setValue(_,"modelViewMatrix",T.modelViewMatrix),Je.setValue(_,"normalMatrix",T.normalMatrix),Je.setValue(_,"modelMatrix",T.matrixWorld),w.isShaderMaterial||w.isRawShaderMaterial){const st=w.uniformsGroups;for(let ct=0,En=st.length;ct<En;ct++){const Ct=st[ct];Ue.update(Ct,ut),Ue.bind(Ct,ut)}}return ut}function Cr(s,S){s.ambientLightColor.needsUpdate=S,s.lightProbe.needsUpdate=S,s.directionalLights.needsUpdate=S,s.directionalLightShadows.needsUpdate=S,s.pointLights.needsUpdate=S,s.pointLightShadows.needsUpdate=S,s.spotLights.needsUpdate=S,s.spotLightShadows.needsUpdate=S,s.rectAreaLights.needsUpdate=S,s.hemisphereLights.needsUpdate=S}function br(s){return s.isMeshLambertMaterial||s.isMeshToonMaterial||s.isMeshPhongMaterial||s.isMeshStandardMaterial||s.isShadowMaterial||s.isShaderMaterial&&s.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return N},this.getRenderTarget=function(){return V},this.setRenderTargetTextures=function(s,S,D){const w=fe.get(s);w.__autoAllocateDepthBuffer=s.resolveDepthBuffer===!1,w.__autoAllocateDepthBuffer===!1&&(w.__useRenderToTexture=!1),fe.get(s.texture).__webglTexture=S,fe.get(s.depthTexture).__webglTexture=w.__autoAllocateDepthBuffer?void 0:D,w.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(s,S){const D=fe.get(s);D.__webglFramebuffer=S,D.__useDefaultFramebuffer=S===void 0};const Pr=_.createFramebuffer();this.setRenderTarget=function(s,S=0,D=0){V=s,P=S,N=D;let w=!0,T=null,$=!1,oe=!1;if(s){const ce=fe.get(s);if(ce.__useDefaultFramebuffer!==void 0)ge.bindFramebuffer(_.FRAMEBUFFER,null),w=!1;else if(ce.__webglFramebuffer===void 0)Ie.setupRenderTarget(s);else if(ce.__hasExternalTextures)Ie.rebindTextures(s,fe.get(s.texture).__webglTexture,fe.get(s.depthTexture).__webglTexture);else if(s.depthBuffer){const Ee=s.depthTexture;if(ce.__boundDepthTexture!==Ee){if(Ee!==null&&fe.has(Ee)&&(s.width!==Ee.image.width||s.height!==Ee.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ie.setupDepthRenderbuffer(s)}}const Re=s.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(oe=!0);const be=fe.get(s).__webglFramebuffer;s.isWebGLCubeRenderTarget?(Array.isArray(be[S])?T=be[S][D]:T=be[S],$=!0):s.samples>0&&Ie.useMultisampledRTT(s)===!1?T=fe.get(s).__webglMultisampledFramebuffer:Array.isArray(be)?T=be[D]:T=be,g.copy(s.viewport),Y.copy(s.scissor),X=s.scissorTest}else g.copy(we).multiplyScalar(G).floor(),Y.copy(Oe).multiplyScalar(G).floor(),X=it;if(D!==0&&(T=Pr),ge.bindFramebuffer(_.FRAMEBUFFER,T)&&w&&ge.drawBuffers(s,T),ge.viewport(g),ge.scissor(Y),ge.setScissorTest(X),$){const ce=fe.get(s.texture);_.framebufferTexture2D(_.FRAMEBUFFER,_.COLOR_ATTACHMENT0,_.TEXTURE_CUBE_MAP_POSITIVE_X+S,ce.__webglTexture,D)}else if(oe){const ce=S;for(let Re=0;Re<s.textures.length;Re++){const be=fe.get(s.textures[Re]);_.framebufferTextureLayer(_.FRAMEBUFFER,_.COLOR_ATTACHMENT0+Re,be.__webglTexture,D,ce)}}else if(s!==null&&D!==0){const ce=fe.get(s.texture);_.framebufferTexture2D(_.FRAMEBUFFER,_.COLOR_ATTACHMENT0,_.TEXTURE_2D,ce.__webglTexture,D)}p=-1},this.readRenderTargetPixels=function(s,S,D,w,T,$,oe,de=0){if(!(s&&s.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ce=fe.get(s).__webglFramebuffer;if(s.isWebGLCubeRenderTarget&&oe!==void 0&&(ce=ce[oe]),ce){ge.bindFramebuffer(_.FRAMEBUFFER,ce);try{const Re=s.textures[de],be=Re.format,Ee=Re.type;if(!Ge.textureFormatReadable(be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ge.textureTypeReadable(Ee)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}S>=0&&S<=s.width-w&&D>=0&&D<=s.height-T&&(s.textures.length>1&&_.readBuffer(_.COLOR_ATTACHMENT0+de),_.readPixels(S,D,w,T,_e.convert(be),_e.convert(Ee),$))}finally{const Re=V!==null?fe.get(V).__webglFramebuffer:null;ge.bindFramebuffer(_.FRAMEBUFFER,Re)}}},this.readRenderTargetPixelsAsync=async function(s,S,D,w,T,$,oe,de=0){if(!(s&&s.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ce=fe.get(s).__webglFramebuffer;if(s.isWebGLCubeRenderTarget&&oe!==void 0&&(ce=ce[oe]),ce)if(S>=0&&S<=s.width-w&&D>=0&&D<=s.height-T){ge.bindFramebuffer(_.FRAMEBUFFER,ce);const Re=s.textures[de],be=Re.format,Ee=Re.type;if(!Ge.textureFormatReadable(be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ge.textureTypeReadable(Ee))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ne=_.createBuffer();_.bindBuffer(_.PIXEL_PACK_BUFFER,Ne),_.bufferData(_.PIXEL_PACK_BUFFER,$.byteLength,_.STREAM_READ),s.textures.length>1&&_.readBuffer(_.COLOR_ATTACHMENT0+de),_.readPixels(S,D,w,T,_e.convert(be),_e.convert(Ee),0);const Ve=V!==null?fe.get(V).__webglFramebuffer:null;ge.bindFramebuffer(_.FRAMEBUFFER,Ve);const je=_.fenceSync(_.SYNC_GPU_COMMANDS_COMPLETE,0);return _.flush(),await Nr(_,je,4),_.bindBuffer(_.PIXEL_PACK_BUFFER,Ne),_.getBufferSubData(_.PIXEL_PACK_BUFFER,0,$),_.deleteBuffer(Ne),_.deleteSync(je),$}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(s,S=null,D=0){const w=Math.pow(2,-D),T=Math.floor(s.image.width*w),$=Math.floor(s.image.height*w),oe=S!==null?S.x:0,de=S!==null?S.y:0;Ie.setTexture2D(s,0),_.copyTexSubImage2D(_.TEXTURE_2D,D,0,0,oe,de,T,$),ge.unbindTexture()};const Lr=_.createFramebuffer(),Ur=_.createFramebuffer();this.copyTextureToTexture=function(s,S,D=null,w=null,T=0,$=null){$===null&&(T!==0?(on("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),$=T,T=0):$=0);let oe,de,ce,Re,be,Ee,Ne,Ve,je;const Ke=s.isCompressedTexture?s.mipmaps[$]:s.image;if(D!==null)oe=D.max.x-D.min.x,de=D.max.y-D.min.y,ce=D.isBox3?D.max.z-D.min.z:1,Re=D.min.x,be=D.min.y,Ee=D.isBox3?D.min.z:0;else{const _t=Math.pow(2,-T);oe=Math.floor(Ke.width*_t),de=Math.floor(Ke.height*_t),s.isDataArrayTexture?ce=Ke.depth:s.isData3DTexture?ce=Math.floor(Ke.depth*_t):ce=1,Re=0,be=0,Ee=0}w!==null?(Ne=w.x,Ve=w.y,je=w.z):(Ne=0,Ve=0,je=0);const ke=_e.convert(S.format),Me=_e.convert(S.type);let Qe;S.isData3DTexture?(Ie.setTexture3D(S,0),Qe=_.TEXTURE_3D):S.isDataArrayTexture||S.isCompressedArrayTexture?(Ie.setTexture2DArray(S,0),Qe=_.TEXTURE_2D_ARRAY):(Ie.setTexture2D(S,0),Qe=_.TEXTURE_2D),_.pixelStorei(_.UNPACK_FLIP_Y_WEBGL,S.flipY),_.pixelStorei(_.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),_.pixelStorei(_.UNPACK_ALIGNMENT,S.unpackAlignment);const Fe=_.getParameter(_.UNPACK_ROW_LENGTH),ut=_.getParameter(_.UNPACK_IMAGE_HEIGHT),yt=_.getParameter(_.UNPACK_SKIP_PIXELS),pt=_.getParameter(_.UNPACK_SKIP_ROWS),Wt=_.getParameter(_.UNPACK_SKIP_IMAGES);_.pixelStorei(_.UNPACK_ROW_LENGTH,Ke.width),_.pixelStorei(_.UNPACK_IMAGE_HEIGHT,Ke.height),_.pixelStorei(_.UNPACK_SKIP_PIXELS,Re),_.pixelStorei(_.UNPACK_SKIP_ROWS,be),_.pixelStorei(_.UNPACK_SKIP_IMAGES,Ee);const Je=s.isDataArrayTexture||s.isData3DTexture,ht=S.isDataArrayTexture||S.isData3DTexture;if(s.isDepthTexture){const _t=fe.get(s),st=fe.get(S),ct=fe.get(_t.__renderTarget),En=fe.get(st.__renderTarget);ge.bindFramebuffer(_.READ_FRAMEBUFFER,ct.__webglFramebuffer),ge.bindFramebuffer(_.DRAW_FRAMEBUFFER,En.__webglFramebuffer);for(let Ct=0;Ct<ce;Ct++)Je&&(_.framebufferTextureLayer(_.READ_FRAMEBUFFER,_.COLOR_ATTACHMENT0,fe.get(s).__webglTexture,T,Ee+Ct),_.framebufferTextureLayer(_.DRAW_FRAMEBUFFER,_.COLOR_ATTACHMENT0,fe.get(S).__webglTexture,$,je+Ct)),_.blitFramebuffer(Re,be,oe,de,Ne,Ve,oe,de,_.DEPTH_BUFFER_BIT,_.NEAREST);ge.bindFramebuffer(_.READ_FRAMEBUFFER,null),ge.bindFramebuffer(_.DRAW_FRAMEBUFFER,null)}else if(T!==0||s.isRenderTargetTexture||fe.has(s)){const _t=fe.get(s),st=fe.get(S);ge.bindFramebuffer(_.READ_FRAMEBUFFER,Lr),ge.bindFramebuffer(_.DRAW_FRAMEBUFFER,Ur);for(let ct=0;ct<ce;ct++)Je?_.framebufferTextureLayer(_.READ_FRAMEBUFFER,_.COLOR_ATTACHMENT0,_t.__webglTexture,T,Ee+ct):_.framebufferTexture2D(_.READ_FRAMEBUFFER,_.COLOR_ATTACHMENT0,_.TEXTURE_2D,_t.__webglTexture,T),ht?_.framebufferTextureLayer(_.DRAW_FRAMEBUFFER,_.COLOR_ATTACHMENT0,st.__webglTexture,$,je+ct):_.framebufferTexture2D(_.DRAW_FRAMEBUFFER,_.COLOR_ATTACHMENT0,_.TEXTURE_2D,st.__webglTexture,$),T!==0?_.blitFramebuffer(Re,be,oe,de,Ne,Ve,oe,de,_.COLOR_BUFFER_BIT,_.NEAREST):ht?_.copyTexSubImage3D(Qe,$,Ne,Ve,je+ct,Re,be,oe,de):_.copyTexSubImage2D(Qe,$,Ne,Ve,Re,be,oe,de);ge.bindFramebuffer(_.READ_FRAMEBUFFER,null),ge.bindFramebuffer(_.DRAW_FRAMEBUFFER,null)}else ht?s.isDataTexture||s.isData3DTexture?_.texSubImage3D(Qe,$,Ne,Ve,je,oe,de,ce,ke,Me,Ke.data):S.isCompressedArrayTexture?_.compressedTexSubImage3D(Qe,$,Ne,Ve,je,oe,de,ce,ke,Ke.data):_.texSubImage3D(Qe,$,Ne,Ve,je,oe,de,ce,ke,Me,Ke):s.isDataTexture?_.texSubImage2D(_.TEXTURE_2D,$,Ne,Ve,oe,de,ke,Me,Ke.data):s.isCompressedTexture?_.compressedTexSubImage2D(_.TEXTURE_2D,$,Ne,Ve,Ke.width,Ke.height,ke,Ke.data):_.texSubImage2D(_.TEXTURE_2D,$,Ne,Ve,oe,de,ke,Me,Ke);_.pixelStorei(_.UNPACK_ROW_LENGTH,Fe),_.pixelStorei(_.UNPACK_IMAGE_HEIGHT,ut),_.pixelStorei(_.UNPACK_SKIP_PIXELS,yt),_.pixelStorei(_.UNPACK_SKIP_ROWS,pt),_.pixelStorei(_.UNPACK_SKIP_IMAGES,Wt),$===0&&S.generateMipmaps&&_.generateMipmap(Qe),ge.unbindTexture()},this.copyTextureToTexture3D=function(s,S,D=null,w=null,T=0){return on('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(s,S,D,w,T)},this.initRenderTarget=function(s){fe.get(s).__webglFramebuffer===void 0&&Ie.setupRenderTarget(s)},this.initTexture=function(s){s.isCubeTexture?Ie.setTextureCube(s,0):s.isData3DTexture?Ie.setTexture3D(s,0):s.isDataArrayTexture||s.isCompressedArrayTexture?Ie.setTexture2DArray(s,0):Ie.setTexture2D(s,0),ge.unbindTexture()},this.resetState=function(){P=0,N=0,V=null,ge.reset(),ae.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Qn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(n){this._outputColorSpace=n;const t=this.getContext();t.drawingBufferColorSpace=nt._getDrawingBufferColorSpace(n),t.unpackColorSpace=nt._getUnpackColorSpace()}}export{gt as S,ie as U,Ff as W,De as a};
