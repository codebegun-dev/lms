package com.mockInterview.security.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)              // used on class (Controller)
@Retention(RetentionPolicy.RUNTIME)    // available at runtime (scanner can read)
public @interface ModulePermission {
    String value(); // e.g. ROLE_MANAGEMENT
}
