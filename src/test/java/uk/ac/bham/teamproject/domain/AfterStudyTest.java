package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class AfterStudyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AfterStudy.class);
        AfterStudy afterStudy1 = new AfterStudy();
        afterStudy1.setId(1L);
        AfterStudy afterStudy2 = new AfterStudy();
        afterStudy2.setId(afterStudy1.getId());
        assertThat(afterStudy1).isEqualTo(afterStudy2);
        afterStudy2.setId(2L);
        assertThat(afterStudy1).isNotEqualTo(afterStudy2);
        afterStudy1.setId(null);
        assertThat(afterStudy1).isNotEqualTo(afterStudy2);
    }
}
