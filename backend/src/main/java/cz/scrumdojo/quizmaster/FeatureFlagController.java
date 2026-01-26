package cz.scrumdojo.quizmaster;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FeatureFlagController {

    @GetMapping("/api/feature-flag")
    public boolean isFeatureEnabled() {
        return FeatureFlag.isEnabled();
    }
}
