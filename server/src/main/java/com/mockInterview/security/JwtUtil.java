//package com.mockInterview.security;
//
//import io.jsonwebtoken.*;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.stereotype.Component;
//
//import java.security.Key;
//import java.util.ArrayList;
//import java.util.Date;
//import java.util.List;
//
//@Component
//public class JwtUtil {
//
//    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
//    private final long jwtExpirationMs = 86400000L; // 1 day
//
//    // include permissions claim
//    public String generateToken(Long userId, String email, List<String> roles, List<String> permissions) {
//        return Jwts.builder()
//                .setSubject(email)
//                .claim("userId", userId)
//                .claim("roles", roles)
//                .claim("permissions", permissions)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
//                .signWith(key)
//                .compact();
//    }
//
//    public boolean validateToken(String token) {
//        try {
//            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
//            return true;
//        } catch (JwtException | IllegalArgumentException ex) {
//            return false;
//        }
//    }
//
//    public Long getUserIdFromToken(String token) {
//        Object idObj = Jwts.parserBuilder().setSigningKey(key).build()
//                .parseClaimsJws(token)
//                .getBody().get("userId");
//        if (idObj instanceof Integer) return ((Integer) idObj).longValue();
//        if (idObj instanceof Long) return (Long) idObj;
//        return Long.valueOf(idObj.toString());
//    }
//
//    public String getEmailFromToken(String token) {
//        return Jwts.parserBuilder().setSigningKey(key).build()
//                .parseClaimsJws(token)
//                .getBody()
//                .getSubject();
//    }
//
//    public List<String> getPermissionsFromToken(String token) {
//        return getListClaim(token, "permissions");
//    }
//
//    public List<String> getRolesFromToken(String token) {
//        return getListClaim(token, "roles");
//    }
//
//    private List<String> getListClaim(String token, String claimName) {
//        Object claimObj = Jwts.parserBuilder().setSigningKey(key).build()
//                .parseClaimsJws(token)
//                .getBody()
//                .get(claimName);
//        List<String> list = new ArrayList<>();
//        if (claimObj instanceof List<?>) {
//            for (Object o : (List<?>) claimObj) list.add(String.valueOf(o));
//        }
//        return list;
//    }
//}

package com.mockInterview.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;

import java.util.Date;


@Component
public class JwtUtil {

    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    private final long jwtExpirationMs = 3600000L; // 1 hour

    public String generateToken(Long userId, String email, String role) {

        return Jwts.builder()
                .setSubject(email)
                .claim("userId", userId)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    public Long getUserIdFromToken(String token) {
        return Long.valueOf(
            Jwts.parserBuilder().setSigningKey(key).build()
                    .parseClaimsJws(token).getBody().get("userId").toString()
        );
    }

    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public String getRoleFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().get("role").toString();
    }
}

