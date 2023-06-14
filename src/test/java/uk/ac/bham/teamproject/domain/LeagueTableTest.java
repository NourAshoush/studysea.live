package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class LeagueTableTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LeagueTable.class);
        LeagueTable leagueTable1 = new LeagueTable();
        leagueTable1.setId(1L);
        LeagueTable leagueTable2 = new LeagueTable();
        leagueTable2.setId(leagueTable1.getId());
        assertThat(leagueTable1).isEqualTo(leagueTable2);
        leagueTable2.setId(2L);
        assertThat(leagueTable1).isNotEqualTo(leagueTable2);
        leagueTable1.setId(null);
        assertThat(leagueTable1).isNotEqualTo(leagueTable2);
    }
}
