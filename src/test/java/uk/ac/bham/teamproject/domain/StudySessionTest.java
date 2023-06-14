package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class StudySessionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StudySession.class);
        StudySession studySession1 = new StudySession();
        studySession1.setId(1L);
        StudySession studySession2 = new StudySession();
        studySession2.setId(studySession1.getId());
        assertThat(studySession1).isEqualTo(studySession2);
        studySession2.setId(2L);
        assertThat(studySession1).isNotEqualTo(studySession2);
        studySession1.setId(null);
        assertThat(studySession1).isNotEqualTo(studySession2);
    }
}
